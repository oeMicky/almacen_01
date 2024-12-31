import { $, component$, useContext, useStore } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { elIdAuxiliar } from '~/functions/comunes';
import { CTX_COMPRA, CTX_NEW_EDIT_COMPRA } from './newEditCompra';

export default component$((props: { letraSelec: any; monedaDefault: string; editandoLetra: boolean }) => {
  //#region definicion_CTX_LETRA
  const definicion_CTX_LETRA = useStore<any>({
    _id: props.letraSelec._id ? props.letraSelec._id : '',
    idAuxiliar: props.letraSelec.idAuxiliar ? props.letraSelec.idAuxiliar : elIdAuxiliar(),
    estado: props.letraSelec.estado ? props.letraSelec.estado : 'ACTIVO',
    fechaVencimiento: props.letraSelec.fechaVencimiento ? props.letraSelec.fechaVencimiento : '',
    moneda: props.letraSelec.moneda ? props.letraSelec.moneda : props.monedaDefault,
    monto: props.letraSelec.monto ? props.letraSelec.monto : '',
    observacion: props.letraSelec.observacion ? props.letraSelec.observacion : '',
  });
  //#endregion definicion_CTX_LETRA

  //#region CONTEXTO
  const ctx = useContext(CTX_NEW_EDIT_COMPRA);
  const documento = useContext(CTX_COMPRA).letras;
  //#endregion CONTEXTO

  //#region REGISTRO DE LETRA
  const registrarLetra = $(async () => {
    if (definicion_CTX_LETRA.fechaVencimiento === '') {
      alert('Seleccione la fecha de vencimiento');
      document.getElementById('in_fechaVencimiento_LETRA')?.focus();
      return;
    }
    if (definicion_CTX_LETRA.monto === '') {
      alert('Ingrese el monto');
      document.getElementById('in_monto_LETRA')?.focus();
      return;
    }

    if (!props.editandoLetra) {
      //INSERTANDO
      documento.push({
        idAuxiliar: elIdAuxiliar(),
        estado: definicion_CTX_LETRA.estado,
        fechaVencimiento: definicion_CTX_LETRA.fechaVencimiento,
        moneda: definicion_CTX_LETRA.moneda,
        monto: definicion_CTX_LETRA.monto,
        observacion: definicion_CTX_LETRA.observacion,
      });
    } else {
      //EDITANDO
      const resultado = documento.find((letr: any) => letr.idAuxiliar === definicion_CTX_LETRA.idAuxiliar);
      console.log('resutafdo', resultado);
      resultado.fechaVencimiento = definicion_CTX_LETRA.fechaVencimiento;
      resultado.moneda = definicion_CTX_LETRA.moneda;
      resultado.monto = definicion_CTX_LETRA.monto;
      resultado.observacion = definicion_CTX_LETRA.observacion;
      // resultado.fechaVe
    }

    // ctx.grabo_Detraccion = true;
    ctx.mostrarPanelNewEditLetra = false;
  });
  //#endregion REGISTRO DE LETRA

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
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            // ctx.mostrarPanelNewEditLetra = false;
            console.log(' props.letraSelec', props.letraSelec);
            console.log('props.letraSelec.moneda', props.letraSelec.moneda);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            // ctx.mostrarPanelNewEditLetra = false;
            console.log('definicion_CTX_LETRA', definicion_CTX_LETRA);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelNewEditLetra = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '8px' }}>Letra</h3>
        {/* ----------------------------------------------------- */}
        {/* GENERALES DE LA LETRA */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* fecha  Vencimiento  */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_fechaVencimiento_LETRA"
                type="date"
                title="Fecha de vencimiento"
                // disabled
                // min={menosXdiasHoy(2)}
                // max={hoy()}
                // min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                // max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                value={definicion_CTX_LETRA.fechaVencimiento}
                onChange$={(e) => {
                  definicion_CTX_LETRA.fechaVencimiento = (e.target as HTMLInputElement).value;
                  document.getElementById('select_Moneda_LETRA')?.focus();
                  //   //validar PERIODO
                  //   const anio = definicion_CTX_F_B_NC_ND.fecha;
                  //   const mes = definicion_CTX_F_B_NC_ND.fecha;
                  //   // //console.log('la fechitaaaa', anio + mes);
                  //   const mas = anio + mes;
                  //   const PPP = losPeriodosCargados.value;
                  //   // //console.log('mas', mas);
                  //   // //console.log('PPP', PPP);
                  //   const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(mas));
                  //   // //console.log('elPeriodo', elPeriodo);
                  //   definicion_CTX_F_B_NC_ND.idPeriodo = elPeriodo._id;
                  //   definicion_CTX_F_B_NC_ND.periodo = elPeriodo.periodo;
                }}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          {/* Moneda  */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="select_Moneda_LETRA"
                title="Tipo de moneda"
                onChange$={() => {
                  // document.getElementById('in_monto_LETRA')?.focus();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('in_monto_LETRA')?.focus();
                  }
                }}
              >
                <option value="PEN" selected={definicion_CTX_LETRA.moneda === 'PEN'}>
                  PEN
                </option>
                <option value="USD" selected={definicion_CTX_LETRA.moneda === 'USD'}>
                  USD
                </option>
              </select>
            </div>
          </div>
          {/* Monto */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_monto_LETRA"
                style={{ width: '100%' }}
                type="number"
                autoFocus
                placeholder="Add monto"
                value={definicion_CTX_LETRA.monto.$numberDecimal ? definicion_CTX_LETRA.monto.$numberDecimal : definicion_CTX_LETRA.monto}
                onChange$={(e) => {
                  definicion_CTX_LETRA.monto = parseFloat((e.target as HTMLInputElement).value.trim());
                }}
                // onInput$={(e) => {
                //   definicion_CTX_DETRACCION_PORCENTAJE.descripcion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                // }}
                // onKeyPress$={(e: any) => {
                //   if (e.key === 'Enter') {
                //     //console.log('Descripcion onKeyDown ENTER');
                //     // (document.getElementById('in_NE_DetraccionDescripcion') as HTMLInputElement)?.focus();
                //     document.getElementById('in_NE_DetraccionPorcentaje')?.focus();
                //     // document.getElementById('btn_grabar_PERSONA')?.focus();
                //   }
                // }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    //console.log("Descripcion onKeyPress ENTER");
                    // (document.getElementById('in_NE_DetraccionDescripcion') as HTMLInputElement)?.focus();
                    document.getElementById('in_observacion_LETRA')?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* Observacion */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_observacion_LETRA"
                style={{ width: '100%' }}
                type="text"
                placeholder="Add observación"
                value={definicion_CTX_LETRA.observacion}
                onChange$={(e) => {
                  definicion_CTX_LETRA.observacion = (e.target as HTMLInputElement).value.trim();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('btn_Registrar_LETRA') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          <br />
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_Registrar_LETRA"
          type="button"
          value="Registrar" //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          onClick$={() => registrarLetra()}
        />
      </div>
    </div>
  );
});
