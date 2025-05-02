// src/prediction/prediction.service.ts

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { InputDataDto } from './dto/input-data.dto';
import { DataServidor } from './dto/data-servidor.dto';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);
  private readonly mlUrl = process.env.ML_SERVICE_URL || 'http://ml-service:8000';

  constructor(private readonly http: HttpService) {}

  async predict(input: InputDataDto): Promise<DataServidor> {
    const url = `${this.mlUrl.replace(/\/$/, '')}/predict`;
    this.logger.log(`Llamando a ML service en ${url} con payload: ${JSON.stringify(input)}`);

    try {
      // Construimos el observable con timeout y captura de errores
      const response$ = this.http
        .post<DataServidor>(url, input)
        .pipe(
          timeout(5000),
          catchError(err => {
            this.logger.error(`Error en HTTP POST a ${url}: ${err.message}`, err.stack);
            throw new HttpException(
              'Error al comunicarse con el servicio de ML',
              HttpStatus.BAD_GATEWAY,
            );
          }),
        );

      // Esperamos la respuesta
      const axiosResp: AxiosResponse<DataServidor> = await lastValueFrom(response$);
      this.logger.log(`Respuesta ML recibida: ${JSON.stringify(axiosResp.data)}`);
      return axiosResp.data;

    } catch (err) {
      if (err instanceof HttpException) {
        // Ya está envuelto
        throw err;
      }
      this.logger.error(`Fallo inesperado en PredictionService: ${err.message}`, err.stack);
      throw new HttpException(
        'Error interno en PredictionService',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
