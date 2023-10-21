"use client";

export default function Swap({ chosenTokenInput, chosenTokenOutput }) {
  return (
    <div>
      <button
        className="border-2 rounded-lg py-2 px-16 mt-6 hover:bg-zinc-300"
        // disabled={!connected}
      >
        SWAP
      </button>
    </div>
  );
}
