import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_COTIZACION, CTX_NEW_EDIT_COTIZACION } from './newEditCotizacion';
import { elIdAuxiliar } from '~/functions/comunes';

export default component$((props: { notaAdicionalServicio: any; contexto: string }) => {
  //#region CONTEXTO
  const ctx = useContext(CTX_NEW_EDIT_COTIZACION);
  const documento = useContext(CTX_COTIZACION).servicios;
  //#endregion CONTEXTO

  //#region REGISTRAR
  const registrarNotaAdicional = $(() => {
    //console.log('first registrarNotaAdicional');
    if (props.notaAdicionalServicio.descripcionEquivalencia.trim() === '') {
      alert('Ingrese la descripción');
      document.getElementById('in_DescripcionEquivalencia_NOTA_ADICIONAL_SERVICIO')?.focus();
      return;
    }
    //console.log('second registrarNotaAdicional', props.notaAdicionalServicio.idAuxiliar);
    if (
      props.notaAdicionalServicio.idAuxiliar === 0 ||
      props.notaAdicionalServicio.idAuxiliar === '' ||
      typeof props.notaAdicionalServicio.idAuxiliar === 'undefined'
    ) {
      //console.log('trercero registrarNotaAdicional');
      documento.push({
        idAuxiliar: parseInt(elIdAuxiliar()),
        idMercaderia: null,
        idEquivalencia: null,
        idKardex: null,
        item: 0,
        tipo: 'NOTA_ADICIONAL_SERVICIO',

        tipoImpuesto: null,
        tipoAfectacionDelImpuesto: null,
        porcentaje: null,

        codigo: '-',

        descripcion: props.notaAdicionalServicio.descripcionEquivalencia.trim().toUpperCase(),
        descripcionEquivalencia: props.notaAdicionalServicio.descripcionEquivalencia.trim().toUpperCase(),

        cantidad: null,
        cantidadEquivalencia: null,

        unidad: 'ZZ',
        unidadEquivalencia: 'ZZ',

        costoUnitarioPEN: null,
        costoUnitarioEquivalenciaPEN: null,

        precioUnitarioPEN: null,

        ventaPEN: null,

        precioUnitarioUSD: null,
        ventaUSD: null,

        codigoContableVenta: null,
        descripcionContableVenta: null,
      });
      ctx.mostrarPanelNotaAdicionalServicio = false;
    }
    // else {
    // }
  });
  //#endregion REGISTRAR

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(330px, 86%, 380px)',
        // width: 'auto',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelNotaAdicionalServicio = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '8px' }}>Nota adicional</h3>
        <div>
          {/* ----------------------------------------------------- */}
          {/* descripcionEquivalencia */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_DescripcionEquivalencia_NOTA_ADICIONAL_SERVICIO"
                style={{ width: '100%' }}
                type="text"
                placeholder="Add descripción"
                value={props.notaAdicionalServicio.descripcionEquivalencia}
                onChange$={(e) => {
                  props.notaAdicionalServicio.descripcionEquivalencia = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    //console.log('Descripcion onKeyPress ENTER');
                    // (document.getElementById('in_NE_DetraccionDescripcion') as HTMLInputElement)?.focus();
                    document.getElementById('in_NE_DetraccionPorcentaje')?.focus();
                  }
                }}
              />
            </div>
          </div>
          <br />
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input id="btn_Registrar_NOTA_ADICIONAL_SERVICIO" type="button" value={'Registrar'} class="btn-centro" onClick$={() => registrarNotaAdicional()} />
      </div>
    </div>
  );
});
