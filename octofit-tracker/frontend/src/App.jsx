import './App.css'

function App() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h1 className="display-6 fw-bold mb-3">OctoFit Tracker</h1>
              <p className="lead text-muted">
                A modern multi-tier fitness application for students to log activities,
                follow teams, and track progress.
              </p>
              <div className="d-flex gap-3 flex-wrap mt-4">
                <span className="badge bg-primary">React 19</span>
                <span className="badge bg-success">Vite</span>
                <span className="badge bg-info text-dark">Express + TypeScript</span>
                <span className="badge bg-warning text-dark">MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
