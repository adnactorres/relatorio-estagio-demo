describe("Navegação", () => {
  beforeEach(() => cy.abrirRelatorio());

  it("abre na Agenda, com a data de hoje no título", () => {
    cy.painelVisivel("resumo");
    cy.get("nav.tabs [role=tab][data-tab=resumo]").should("have.attr", "aria-selected", "true");
    const hoje = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
    cy.get("#agn h2").invoke("text").should("contain", hoje.replace(/^0/, ""));
  });

  const abas = [
    ["Diário", "diario"],
    ["Indicadores", "indicadores"],
    ["Clientes", "clientes"],
    ["Dados do estágio", "dados"],
    ["Acadêmico", "academico"],
    ["Agenda", "resumo"],
  ];

  abas.forEach(([nome, id]) => {
    it(`a aba ${nome} mostra só o painel dela`, () => {
      cy.abrirAba(nome);
      cy.painelVisivel(id);
      cy.get(`nav.tabs [role=tab][data-tab=${id}]`).should("have.attr", "aria-selected", "true");
      cy.get("nav.tabs [aria-selected=true]").should("have.length", 1);
    });
  });

  const bastidores = [
    ["Como foi feito", "sobre"],
    ["O Bit", "bit"],
    ["SQL", "sql"],
    ["Próximas automações", "futuro"],
  ];

  bastidores.forEach(([nome, id]) => {
    it(`o link "${nome}" do topo abre a página de bastidores`, () => {
      cy.abrirBastidores(nome);
      cy.painelVisivel(id);
    });
  });

  it("o aviso de demonstração abre e fecha o texto completo", () => {
    cy.get("#demoFull").should("not.be.visible");
    cy.get("#demoMore").should("have.attr", "aria-expanded", "false").click();
    cy.get("#demoMore").should("have.attr", "aria-expanded", "true");
    cy.get("#demoFull").should("be.visible").and("contain", "nada do que você digitar é salvo");
    cy.get("#demoMore").click();
    cy.get("#demoFull").should("not.be.visible");
  });
});
