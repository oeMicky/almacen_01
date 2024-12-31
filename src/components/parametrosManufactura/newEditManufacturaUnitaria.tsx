import { component$, useContext, useStore, $ } from '@builder.io/qwik';
// import { loadTiposComprobantePago } from "~/apis/sunat.api";
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
// import  { IDocumento } from "~/interfaces/iDocumento";
import type { IManufacturaUnitaria } from '~/interfaces/iParametrosManufactura';
import { CTX_INDEX_PARAMETROS_MANUFACTURA } from '~/routes/(ordenesProduccion)/parametrosManufactura';
// import styleFormulario from "../../css/formulario.css?inline";
import { inUpManufacturaUnitaria } from '~/apis/parametrosManufactura.api';
import { parametrosGlobales } from '~/routes/login';

export default component$((props: { manuUnitaSelecci: any; idParametrosManufactura: string; totalCostosDirectos: any }) => {
  // useStyles$(styleFormulario);
  //#region definicion_CTX_MANUFACTURA_UNITARIA
  const definicion_CTX_MANUFACTURA_UNITARIA = useStore<IManufacturaUnitaria>({
    _id: props.manuUnitaSelecci._id ? props.manuUnitaSelecci._id : '',
    manufacturaUnitaria: props.manuUnitaSelecci.manufacturaUnitaria ? props.manuUnitaSelecci.manufacturaUnitaria : '',
    tiempoManufacturaUnitariaPorHora: props.manuUnitaSelecci.tiempoManufacturaUnitariaPorHora
      ? props.manuUnitaSelecci.tiempoManufacturaUnitariaPorHora.$numberDecimal
        ? props.manuUnitaSelecci.tiempoManufacturaUnitariaPorHora.$numberDecimal
        : props.manuUnitaSelecci.tiempoManufacturaUnitariaPorHora
      : 0,
    totalCostosDirectos: props.manuUnitaSelecci.totalCostosDirectos
      ? props.manuUnitaSelecci.totalCostosDirectos.$numberDecimal
        ? props.manuUnitaSelecci.totalCostosDirectos.$numberDecimal
        : props.manuUnitaSelecci.totalCostosDirectos
      : props.totalCostosDirectos,
    // costoManufacturaUnitario: props.manuUnitaSelecci.costoPEN ? props.manuUnitaSelecci.costoPEN : 0,
  });
  //#endregion definicion_CTX_MANUFACTURA_UNITARIA

  //#region CONTEXTOS
  const ctx = useContext(CTX_INDEX_PARAMETROS_MANUFACTURA);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  // const ini = useSignal(0);
  // const LosTCPcargados = useSignal([]);
  //#endregion INICIALIZACION

  //#region REGISTRAR MANUFACTURA UNITARIA
  const registrarManufacturaUnitaria = $(async () => {
    if (definicion_CTX_MANUFACTURA_UNITARIA.manufacturaUnitaria.trim() === '') {
      alert('Ingrese la manufactura unitaria.');
      document.getElementById('in_ManufacturaUnitaria_MANUFACTURA_UNITARIA')?.focus();
      return;
    }
    if (definicion_CTX_MANUFACTURA_UNITARIA.tiempoManufacturaUnitariaPorHora === '') {
      alert('Ingrese el tiempo de manufactura unitaria por hora.');
      document.getElementById('in_TiempoManufacturaUnitariaPorHora_MANUFACTURA_UNITARIA')?.focus();
      return;
    }
    await inUpManufacturaUnitaria({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idParametrosManufactura: props.idParametrosManufactura,
      idManufacturaUnitaria: definicion_CTX_MANUFACTURA_UNITARIA._id,
      manufacturaUnitaria: definicion_CTX_MANUFACTURA_UNITARIA.manufacturaUnitaria,
      tiempoManufacturaUnitariaPorHora: definicion_CTX_MANUFACTURA_UNITARIA.tiempoManufacturaUnitariaPorHora,
      totalCostosDirectos: definicion_CTX_MANUFACTURA_UNITARIA.totalCostosDirectos,
      costoManufacturaUnitario: definicion_CTX_MANUFACTURA_UNITARIA.tiempoManufacturaUnitariaPorHora * definicion_CTX_MANUFACTURA_UNITARIA.totalCostosDirectos,

      usuario: parametrosGlobales.usuario,
    });

    //console.log("manufactu", manufactu);

    ctx.grabo_ManufacturaUnitaria = true;
    ctx.mostrarPanelNewEditManufacturaUnitaria = false;
  });
  //#endregion REGISTRAR MANUFACTURA UNITARIA

  return (
    <div
      style={{
        width: 'clamp(386px, 86%, 500px)',
        // width: 'auto',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log("manuUnitaSelecci", props.manuUnitaSelecci);
            //console.log("idParametrosManufactura", props.idParametrosManufactura);
            //console.log("totalCostosDirectos", props.totalCostosDirectos);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelNewEditManufacturaUnitaria = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>Registro de manufactura unitaria</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Manufactura unitaria */}
          <div class="linea-formulario">
            <label>Manufactura unitaria </label>
            <input
              id="in_ManufacturaUnitaria_MANUFACTURA_UNITARIA"
              style={{ width: '250px' }}
              type="text"
              placeholder="Add manufactura unitaria"
              value={definicion_CTX_MANUFACTURA_UNITARIA.manufacturaUnitaria}
              onInput$={(e) => {
                definicion_CTX_MANUFACTURA_UNITARIA.manufacturaUnitaria = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('in_TiempoManufacturaUnitariaPorHora_MANUFACTURA_UNITARIA') as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
          {/* tiempoManufacturaUnitariaPorHora */}
          <div class="linea-formulario">
            <label>tiempo manufactura unitaria x hora</label>
            <input
              id="in_TiempoManufacturaUnitariaPorHora_MANUFACTURA_UNITARIA"
              style={{ width: '250px' }}
              type="number"
              placeholder="Add tiempo manufactura unitaria x hora"
              value={definicion_CTX_MANUFACTURA_UNITARIA.tiempoManufacturaUnitariaPorHora}
              onInput$={(e) => {
                definicion_CTX_MANUFACTURA_UNITARIA.tiempoManufacturaUnitariaPorHora = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('in_TotalCostosDirectos_MANUFACTURA_UNITARIA') as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
          {/* totalCostosDirectos */}
          <div class="linea-formulario">
            <label>Total costos directos PEN</label>
            <input
              id="in_TotalCostosDirectos_MANUFACTURA_UNITARIA"
              style={{ width: '250px' }}
              type="number"
              readOnly
              // disabled
              placeholder="Add total costos directos"
              value={definicion_CTX_MANUFACTURA_UNITARIA.totalCostosDirectos}
              // onInput$={(e) => {
              //   definicion_CTX_MANUFACTURA_UNITARIA.totalCostosDirectos = (e.target as HTMLInputElement).value.trim().toUpperCase();
              // }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('in_CostoManufacturaUnitario_MANUFACTURA_UNITARIA') as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
          {/* costoManufacturaUnitario */}
          <div class="linea-formulario">
            <label>Costo manufactura unitario PEN</label>
            <input
              id="in_CostoManufacturaUnitario_MANUFACTURA_UNITARIA"
              style={{ width: '250px' }}
              type="number"
              readOnly
              placeholder="Add costo manufactura unitario"
              value={definicion_CTX_MANUFACTURA_UNITARIA.tiempoManufacturaUnitariaPorHora * definicion_CTX_MANUFACTURA_UNITARIA.totalCostosDirectos}
              // onInput$={(e) => {
              //   definicion_CTX_MANUFACTURA_UNITARIA.costoManufacturaUnitario = (e.target as HTMLInputElement).value.trim().toUpperCase();
              // }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('btn_ManufacturaUnitaria_MANUFACTURA_UNITARIA') as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_ManufacturaUnitaria_MANUFACTURA_UNITARIA"
          type="button"
          value="Registrar"
          class="btn-centro"
          onClick$={() => registrarManufacturaUnitaria()}
        />
      </div>
    </div>
  );
});
