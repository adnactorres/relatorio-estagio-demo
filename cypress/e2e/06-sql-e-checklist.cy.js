describe("Página de SQL", () => {
  beforeEach(() => {
    cy.abrirRelatorio();
    cy.abrirBastidores("SQL");
  });

  it("roda a consulta padrão e mostra os dias por cliente", () => {
    cy.get("#qRun").click();
    cy.get("#qStatus").should("have.text", "5 linhas");
    cy.get("#qOut tr").should("have.length", 6); // cabeçalho + 5 clientes
    cy.get("#qOut").should("contain", "UFVS");
  });

  it("cada consulta pronta preenche o editor e roda", () => {
    cy.get("#qPre button").each(($b) => {
      cy.wrap($b).click();
      cy.get("#qSql").invoke("val").should("match", /^\s*SELECT/i);
      cy.get("#qStatus").invoke("text").should("match", /\d+ linhas?/);
    });
  });

  ["DELETE FROM dias", "SELEC errado", "SELECT 1; DROP TABLE dias"].forEach((sql) => {
    it(`recusa o que não é uma única consulta SELECT: "${sql}"`, () => {
      cy.get("#qSql").clear().type(sql, { parseSpecialCharSequences: false });
      cy.get("#qRun").click();
      cy.get("#qStatus").should("have.text", "Use uma única consulta SELECT.");
    });
  });
});

describe("Checklist de testes (Próximas automações)", () => {
  it("classifica os erros do histórico e monta o checklist", () => {
    cy.abrirRelatorio();
    cy.abrirBastidores("Próximas automações");
    cy.get("#ckRun").click();
    cy.get("#ckStatus").should("contain", "classificados");
    cy.get("#ckOut").should("contain", "Checklist para a próxima tela");
  });
});
