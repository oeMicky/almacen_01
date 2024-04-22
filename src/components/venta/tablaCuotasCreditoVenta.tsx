import { component$, useContext, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN, redondeo2Decimales } from '~/functions/comunes';
import ImgButton from '../system/imgButton';
import { CTX_F_B_NC_ND } from './addVenta'; //ICuotaCreditoVenta

// export interface ICuota {
//   idAuxiliar: number;
//   fechaCuota: string;
//   importeCuotaPEN: number;
// }numeroFilas: number;

export default component$((props: { registros: any[]; numero: number }) => {
  const ctx_f_b_nc_nd = useContext(CTX_F_B_NC_ND);
  const num_regi = useSignal(0);

  let sumaCuotas = 0; //useSignal(0);

  // useTask$(({ track }) => {
  //   track(() => ctx_add_venta_tabla);
  //   console.log(
  //     'chequeoooooo .............................. ctx_add_venta_tabla.cuotasCredito',
  //     ctx_add_venta_tabla.cuotasCredito
  //   );
  // });

  // useTask$(({ track }) => {
  //   track(() => props.numeroFilas);
  //   console.log('chequeoooooo .............................. ctx_add_venta_tabla.cuotasCredito', props.numeroFilas);
  //   // sumaCuotas = sumaCuotas + redondeo2Decimales(cuota.importeCuotaPEN);
  // });

  return (
    // <div>TABLASSSS</div>
    <table
      style={{ fontSize: '0.8rem', fontWeight: 'lighter', margin: '5px 0' }}
      onChange$={() => {
        num_regi.value = props.numero;
      }}
    >
      <thead>
        <tr>
          <th>Nro. Cuota</th>
          <th>Fecha</th>
          <th>Importe</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {props.registros.map((value: any, index: any) => {
          //   const { idAuxiliar, fechaCuota, importeCuotaPEN } = cuota;
          const indexItem = index + 1;
          // sumaCuotas.value = sumaCuotas.value + redondeo2Decimales(cuota.importeCuotaPEN);
          sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);

          //   importeTotal(sumaCuotas);
          // Cuota{}
          return (
            <tr key={value.idAuxiliar}>
              <td key={value.idAuxiliar}>{`${cerosALaIzquierda(indexItem, 3)}`}</td>
              <td>{formatoDDMMYYYY_PEN(value.fechaCuota)}</td>
              <td style={{ textAlign: 'end' }}>
                {/* {cuota.importeCuotaPEN} */}
                {`${value.importeCuotaPEN.toLocaleString('en-PE', {
                  // style: 'currency',
                  currency: 'PEN',
                  minimumFractionDigits: 2,
                })}`}
              </td>
              <td style={{ textAlign: 'center' }}>
                <ImgButton
                  src={images.edit}
                  alt="icono de editar"
                  height={12}
                  width={12}
                  title="Editar ítem"
                  //   onClick={() => {
                  //     mostrarEdit({
                  //       idAuxiliar,
                  //       fechaCuota,
                  //       importeCuotaPEN,
                  //     });
                  //   }}
                />
                <ImgButton
                  src={images.trash}
                  alt="icono de eliminar"
                  height={12}
                  width={12}
                  title="Eliminar ítem"
                  //   onClick={() => {
                  //     onDel(idAuxiliar);
                  //   }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={2} style={{ textAlign: 'end' }}>
            Suma Cuotas
          </th>
          <th colSpan={1} style={{ textAlign: 'end' }}>
            {`${sumaCuotas.toLocaleString('en-PE', {
              style: 'currency',
              currency: 'PEN',
              minimumFractionDigits: 2,
            })}`}
          </th>
          <th>
            <button
              onClick$={() => {
                console.log('ctx_add_venta_tabla.cuotasCredito', ctx_f_b_nc_nd.cuotasCredito);
              }}
            >
              ver ctx
            </button>
          </th>
        </tr>
      </tfoot>
    </table>
  );
});
