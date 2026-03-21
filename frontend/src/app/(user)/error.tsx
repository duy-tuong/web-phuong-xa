"use client";

type UserErrorProps = {
  error: Error;
  reset: () => void;
};

export default function UserError({ error, reset }: UserErrorProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      <h2 className="text-lg font-semibold">Da xay ra loi o khu vuc User</h2>
      <p className="mt-2 text-sm">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
      >
        Thu lai
      </button>
    </div>
  );
}
