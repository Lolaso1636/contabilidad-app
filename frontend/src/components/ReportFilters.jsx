import { useState } from "react";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

function ReportFilters({ onGenerate }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return (
    <div style={{ marginTop: '2rem' }}>
      <select
        value={month}
        onChange={e => setMonth(Number(e.target.value))}
      >
        {MONTHS.map((name, index) => (
          <option key={index + 1} value={index + 1}>
            {name}
          </option>
        ))}
      </select>

    <input
        type="text"
        value={year}
        onChange={e => setYear(Number(e.target.value))}
        style={{ marginLeft: '1rem', width: '100px' }}
    />


      <button
        style={{ marginLeft: '1rem' }}
        onClick={() => onGenerate(year, month)}
      >
        📊 Ver reporte
      </button>
    </div>
  );
}

export default ReportFilters;
