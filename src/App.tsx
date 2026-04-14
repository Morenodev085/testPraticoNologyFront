import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [valor, setValor] = useState('');
  const [is_Vip, setIs_Vip] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [cupom, setCupom] = useState("0");

  const carregarHistorico = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/historico');
      console.log("Histórico carregado:", res.data[0]); // Log do primeiro item para verificar a estrutura
      setHistorico(res.data);
    } catch (err) {
      console.error("Erro ao carregar histórico", err);
    }
  };

  useEffect(() => { carregarHistorico(); }, []);

  const handleCalcular = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/cashback', {
        valor: parseFloat(valor),
        cupom: parseFloat(cupom),
        vip: is_Vip
      });
      setResultado(res.data);
      carregarHistorico();
    } catch (err) {
      alert("Erro na conexão com o servidor Python!");
    }
  };

  return (
    <div className="container py-5">

      <header className="text-center mb-5">
        <h1 className="text-center mt-5">Calculadora de Cashback</h1>
        <p className="lead">Desafio Tecnico Nology</p>
      </header>

      <div className="row">
        <div className="col-md-5">
          <div className="card shwdow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4 text-center">Novo Cálculo</h5>
              <form onSubmit={handleCalcular}>
                <div className="mb-3">
                  <label className="form-label">Valor da compra (R$)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Ex: 600"
                  />

                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="vipCheck"
                    checked={is_Vip}
                    onChange={(e) => setIs_Vip(e.target.checked)}
                  />
                  <label className="form-check-label"
                    htmlFor="vipCheck">Cliente VIP</label>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Selecione o Cupom de Desconto</label>

                  <select
                    className="form-select"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                  >
                    <option value="0">Sem Cupom (0%)</option>
                    <option value="10">Cupom de Bronze (10%)</option>
                    <option value="15">Cupom de Prata (15%)</option>
                    <option value="20">Cupom de Ouro (20%)</option>
                  </select>

                  <div className="form-text">
                    Escolha um dos cupons oficiais para aplicar o desconto.
                  </div>
                </div>
                <button
                  className="btn btn-primary w-100"
                  type="submit">
                  Calcular
                </button>
              </form>
              {resultado && (
                <div className="alert alert-success mt-4">
                  <p>Valor com desconto <strong>R$ {resultado.valorFinal}</strong></p>
                  <h4 className="akert-heading text-dark">Cashback: R$ {resultado.cashback}</h4>
                </div>
              )}


            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className=" card-title md-4">Últimas Consultas</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className=" table-light">
                    <tr>
                      <th>Valor</th>
                      <th>Cashback</th>
                      <th>VIP</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item, index) => (
                      <tr key={index}>
                        <td>R$ {item.valor.toFixed(2)}</td>
                        <td className="text-success fw-bold">R$ {item.cashback.toFixed(2)}</td>
                        <td>{item.vip ? 'Sim' : 'Não'}</td>
                        <td className="small text-muted">{item.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
