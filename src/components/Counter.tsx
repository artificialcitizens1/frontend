import { useCounterStore } from "../store";

export const Counter = () => {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>
      <div className="space-x-4">
        <button
          onClick={increment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Decrement
        </button>
        <button
          onClick={reset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
