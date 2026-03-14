import { useContext } from "react";
import AppContext from "./AppContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSearchParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart({ view_logs, text }) {
  const { movies } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const genre = searchParams.get("genre");
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#94a3b8",
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: text,
        color: "#e2e8f0",
        font: { size: 18, weight: "bold" },
        align: "start",
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(71, 85, 105, 0.2)" },
      },
    },
  };
  let labels = [];
  let views = [];
  if (genre) {
    const moviesWithGenre = movies?.docs?.filter((value) =>
      value.genre?.some((item) => encodeURIComponent(item.name) === genre)
    );
    if (moviesWithGenre?.length > 0) {
      moviesWithGenre.forEach((value) => {
        labels.push(value.title);
        views.push(value.view);
      });
    }
  } else {
    if (view_logs?.length > 0) {
      labels = view_logs?.map((value) => value.movieId.title);
      views = view_logs?.map((value) => value.count);
    }
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Lượt xem",
        data: views,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        borderWidth: 0,
        borderRadius: 0,
      },
    ],
  };

  return (
    <div className="w-full h-[500px] p-8 bg-slate-900 border-t border-b border-slate-800 rounded-none shadow-none">
      <Bar options={options} data={chartData} />
    </div>
  );
}
