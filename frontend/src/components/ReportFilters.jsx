import { useState } from "react";
import { BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function ReportFilters({ onGenerate }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return (
    <div className="bg-slate-900 rounded-xl p-5 shadow-md border border-slate-700 mb-6">
      
      {/* HEADER */}
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        Filtros de reporte
      </h3>

      <div className="flex flex-wrap gap-4 items-end">

        {/* MES */}
        <div className="relative">
          <label className="block text-sm text-slate-400 mb-1">
            Mes
          </label>

          <Clock className="absolute left-3 top-9 w-4 h-4 text-slate-400" />

          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 border border-slate-700
                       rounded-lg pl-9 pr-3 py-2 focus:outline-none
                       focus:ring-2 focus:ring-blue-500"
          >
            {MONTHS.map((name, index) => (
              <option key={index + 1} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* AÑO */}
        <div className="relative">
          <label className="block text-sm text-slate-400 mb-1">
            Año
          </label>

          <Calendar className="absolute left-3 top-9 w-4 h-4 text-slate-400" />

          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 border border-slate-700
                       rounded-lg pl-9 pr-3 py-2 w-32 focus:outline-none
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BOTÓN */}
        <button
          onClick={() => onGenerate(year, month)}
          className="ml-auto bg-blue-600 hover:bg-blue-500
                     text-white font-medium rounded-lg
                     px-5 py-2 transition
                     flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Ver reporte
        </button>
      </div>
    </div>
  );
}

export default ReportFilters;
