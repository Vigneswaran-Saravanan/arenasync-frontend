function CreateMatch() {
  return (
    <div className="container mt-5">
      <h2>Create Match</h2>

      <input className="form-control mb-2" placeholder="Match Title" />
      <input className="form-control mb-2" placeholder="Location" />
      <input className="form-control mb-2" placeholder="Date & Time" />

      <button className="btn btn-primary w-100">
        Create Match
      </button>
    </div>
  );
}

export default CreateMatch;