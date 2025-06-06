export default function InputField({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        className="w-full p-2 border rounded"
        {...props}
      />
    </div>
  );
}