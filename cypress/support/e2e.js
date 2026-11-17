// Comandos reaproveitados pelos testes.
// Os dados da demo são fictícios e as datas acompanham o dia de hoje,
// por isso os testes evitam datas fixas e leem a data da própria página.

// Abre a demo já carregada, com o tema claro e sem estado salvo.
Cypress.Commands.add("abrirRelatorio", () => {
  cy.clearLocalStorage();
  cy.visit("index.html");
  cy.get("#p-resumo").should("be.visible");
  cy.get("#agn h2").should("not.be.empty");
});

// Clica numa aba do menu principal pelo texto (Agenda, Diário, ...).
Cypress.Commands.add("abrirAba", (nome) => {
  cy.get("nav.tabs [role=tab]").contains(new RegExp(`^${nome}$`)).click();
});

// Abre uma das páginas de bastidores pelos links do topo
// (Como foi feito, O Bit, SQL, Próximas automações).
Cypress.Commands.add("abrirBastidores", (nome) => {
  cy.get(".hero-links a").contains(nome).click();
});

// Garante que só o painel indicado está visível.
Cypress.Commands.add("painelVisivel", (id) => {
  cy.get(`#p-${id}`).should("be.visible");
  cy.get(".pane:visible").should("have.length", 1);
});

// Lê o contador do Diário ("35 de 35 dias") e devolve os dois números.
Cypress.Commands.add("contadorDiario", () => {
  return cy
    .get("#count")
    .invoke("text")
    .then((t) => {
      const [, mostrados, total] = t.match(/(\d+) de (\d+)/);
      return { mostrados: Number(mostrados), total: Number(total) };
    });
});
