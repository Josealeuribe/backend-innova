import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ActualizarRazonSocialUseCase } from '../../application/use-cases/actualizar-razon-social.use-case';
import { CrearRazonSocialUseCase } from '../../application/use-cases/crear-razon-social.use-case';
import { EliminarRazonSocialUseCase } from '../../application/use-cases/eliminar-razon-social.use-case';
import { ListarRazonesSocialesUseCase } from '../../application/use-cases/listar-razones-sociales.use-case';
import { ObtenerRazonSocialUseCase } from '../../application/use-cases/obtener-razon-social.use-case';
import { RazonSocialContratoFechasInvalidasError, RazonSocialCorreoAlreadyExistsError, RazonSocialForeignKeyError, RazonSocialNitAlreadyExistsError, RazonSocialNotFoundError, RazonSocialRangoResolucionInvalidoError, RazonSocialResolucionFechasInvalidasError, RazonSocialUbicacionInvalidaError } from '../../errors/razon-social.errors';
import { ActualizarRazonSocialDto } from '../dto/actualizar-razon-social.dto';
import { CrearRazonSocialDto } from '../dto/crear-razon-social.dto';
import { ListarRazonesSocialesQueryDto } from '../dto/listar-razones-sociales-query.dto';

@Controller('razones-sociales')
export class RazonesSocialesController {
  constructor(private readonly crear: CrearRazonSocialUseCase, private readonly listar: ListarRazonesSocialesUseCase, private readonly obtener: ObtenerRazonSocialUseCase, private readonly actualizar: ActualizarRazonSocialUseCase, private readonly eliminar: EliminarRazonSocialUseCase) {}
  @Post() async create(@Body() dto: CrearRazonSocialDto) { try { return await this.crear.execute(dto); } catch (e) { this.handle(e); } }
  @Get() findAll(@Query() query: ListarRazonesSocialesQueryDto) { return this.listar.execute(query); }
  @Get(':idRazonSocial') async findOne(@Param('idRazonSocial', ParseIntPipe) id: number) { try { return await this.obtener.execute(id); } catch (e) { this.handle(e); } }
  @Patch(':idRazonSocial') async update(@Param('idRazonSocial', ParseIntPipe) id: number, @Body() dto: ActualizarRazonSocialDto) { try { return await this.actualizar.execute(id, dto); } catch (e) { this.handle(e); } }
  @Delete(':idRazonSocial') async remove(@Param('idRazonSocial', ParseIntPipe) id: number) { try { return { message: 'Razón social inactivada correctamente.', data: await this.eliminar.execute(id) }; } catch (e) { this.handle(e); } }
  private handle(error: unknown): never {
    if (error instanceof RazonSocialNotFoundError) throw new NotFoundException(error.message);
    if (error instanceof RazonSocialNitAlreadyExistsError || error instanceof RazonSocialCorreoAlreadyExistsError) throw new ConflictException(error.message);
    if (error instanceof RazonSocialForeignKeyError || error instanceof RazonSocialUbicacionInvalidaError || error instanceof RazonSocialContratoFechasInvalidasError || error instanceof RazonSocialResolucionFechasInvalidasError || error instanceof RazonSocialRangoResolucionInvalidoError) throw new BadRequestException(error.message);
    if ((error as { code?: string })?.code === 'P2002') throw new ConflictException('Ya existe un registro con un valor único repetido.');
    throw error;
  }
}
