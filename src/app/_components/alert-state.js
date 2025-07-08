import React from 'react';

export const AlertState = ({ success, error }) => {
  return (
    <>
      {error && (
        <div className="rounded-md bg-rose-50 p-2 text-center text-sm font-medium text-balance text-rose-500">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-emerald-50 p-2 text-center text-sm font-medium text-balance text-emerald-500">
          {success}
        </div>
      )}
    </>
  );
};
