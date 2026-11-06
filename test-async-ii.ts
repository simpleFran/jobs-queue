function esperarSegundos(segundos: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, segundos * 1000);
  });
}

async function executarTarefa(nome: string, segundos: number) {
  console.log(`[${nome}] 🚀 Iniciou...`);

  // O await pausa ESTA função, mas o Node vai cuidar de outras coisas enquanto isso
  await esperarSegundos(segundos);

  console.log(`[${nome}] ✅ Terminou após ${segundos} segundos!`);
}

// Disparando DUAS tarefas assíncronas ao mesmo tempo, sem esperar uma acabar para começar a outra
async function iniciarSistema() {
  console.log("--- SISTEMA INICIADO ---");

  // Dispara a Tarefa A (demora 3 segundos) e a Tarefa B (demora 1 segundo) juntas!
  executarTarefa("Tarefa A", 3);
  executarTarefa("Tarefa B", 1);

  console.log(
    "--- CÓDIGO DA FUNÇÃO PRINCIPAL CONTINUOU RODANDO IMEDIATAMENTE ---",
  );
}

iniciarSistema();
