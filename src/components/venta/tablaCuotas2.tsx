import { $, component$, useBrowserVisibleTask$, useResource$ } from '@builder.io/qwik';
import registro from '~/reports/98/registro';

export default component$((props: { numero: number; registros: any[]; num_grabaciones: number }) => {
  //   useBrowserVisibleTask$(() => {
  //     const misRegistros = registro;
  //   });
  //   const lasCuotas = useResource$(({ track }) => {
  //     track(registro);
  //     const res = registro;
  //     return res.json();
  //   });

  return (
    <table>
      <thead>
        <tr>
          <th>importe {props.num_grabaciones}</th>
        </tr>
      </thead>
      <tbody>
        {props.registros.map((value) => {
          const { importeCuotaPEN } = value;
          return (
            <tr>
              <td>{importeCuotaPEN}</td>
            </tr>
          );
        })}
        {/* <td>{props.numero}</td> */}
      </tbody>
    </table>
  );
});
