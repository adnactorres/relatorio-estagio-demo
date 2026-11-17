# Relatório de Estágio com IA (demo)

[![Testes Cypress](https://github.com/adnactorres/relatorio-estagio-demo/actions/workflows/cypress.yml/badge.svg)](https://github.com/adnactorres/relatorio-estagio-demo/actions/workflows/cypress.yml)

Versão de demonstração do relatório interativo que eu uso no meu estágio em testes de software (QA). Ele registra o dia a dia, prepara a daily e tem um agente de IA, o **Bit**, que responde perguntas sobre os registros e executa ações na página.

**Ver funcionando:** https://adnactorres.github.io/relatorio-estagio-demo/

> Todos os dados desta demo são fictícios: empresa, clientes, pessoas e ordens de serviço foram inventados, e as datas são recalculadas a partir do dia em que a página é aberta. Nada do que você digitar é salvo.

## O problema

- Meu relatório diário era um texto corrido, difícil de ler e de acompanhar ao longo das semanas.
- Trabalho em ordens de serviço (OS) de squads diferentes, com dailies em horários próximos. Toda manhã eu precisava descobrir de qual participar e planejar o meu reporte para cada OS.
- Para achar um registro antigo (um erro, um cliente, uma tarefa validada) eu precisava reler tudo.

## O que o relatório faz

| Área | O que tem |
| --- | --- |
| Agenda | Compromissos de hoje com as dailies e a indicação de qual participar pela OS do dia anterior, próximos dias e o meu reporte para a daily, agrupado por squad. Quando não sabe de qual squad é uma OS, a página pergunta. |
| Diário | Um cartão por dia, com busca e filtros por time, cliente e tipo de atividade, em lista ou em calendário |
| Indicadores | Números do estágio: dias registrados, clientes, erros, melhorias e bloqueios |
| Clientes | Dias trabalhados por cliente e por ordem de serviço |
| Dados do estágio | Informações do termo de compromisso e dos módulos do sistema |
| Acadêmico | Provas e prazos da faculdade |
| Botão + | Cadastra um dia, por formulário que identifica clientes, OS e tipo de atividade a partir do texto, ou cria um lembrete. Também dá para clicar em um dia vazio do calendário. |

## O Bit, o agente da página

O Bit recebe a mensagem, consulta os dados do relatório e, quando precisa agir, chama uma ferramenta da página.

| Ferramenta | O que faz |
| --- | --- |
| `adicionar_lembrete` | Cria um lembrete na agenda. Se faltar a data, o Bit pergunta antes. |
| `registrar_dia` | Salva o registro de um dia, só depois de mostrar o resumo e receber a confirmação. |
| `registrar_pedido` | Anota um pedido de mudança na página. O Bit não altera o relatório sozinho. |

Regras que defini para ele:

- Responder só com base nos dados do relatório e dizer quando não encontrou.
- Não inventar datas, clientes, ordens de serviço ou números.
- Perguntar quando falta informação e pedir confirmação antes de salvar.
- Nunca dizer que mudou a página.

### Um mascote com personalidade

O Bit não é só o chat: é um personagem, um banco de dados azul de três discos segurando um gráfico, que vive no cabeçalho e reage ao que acontece na página.

- **Muda ao longo do dia e do ano:** toma cafezinho no começo do expediente, dorme à noite, fica preocupado quando o dia tem bloqueio e ganha versões de Halloween, Natal, Ano Novo e aniversário.
- **Reage ao que é registrado:** comemora com confete quando um dia é salvo, fica triste quando um erro é anotado e acompanha o preenchimento do formulário de um cantinho da tela.
- **Tem um easter egg** para quem clicar nele várias vezes seguidas.

Por que ter um mascote em uma ferramenta de trabalho:

- **Registrar o dia vira um hábito mais leve.** Um diário só funciona se for preenchido todo dia, e uma reação simpática ao salvar ajuda nisso.
- **O retorno é imediato e não interrompe.** O Bit mostra que algo foi salvo ou que um bloqueio foi registrado sem abrir janelas.
- **O agente tem um rosto.** Quem conversa no chat é o mesmo personagem que reage na página, então fica claro quem está respondendo.
- **É divertido.** Uma ferramenta usada todo dia pode ter um pouco de alegria.

As animações são desligadas para quem configurou o sistema para reduzir movimento, e as versões temáticas mudam só a aparência: as respostas do Bit continuam limitadas aos dados do relatório. Todas as versões aparecem lado a lado na página **O Bit**.

### Testes do Bit

A página **O Bit** traz nove casos de teste, um para cada regra. Ao rodar, cada caso é enviado ao Bit na conversa, ao vivo, e a página confere a resposta e a ferramenta chamada. Durante os testes, as ferramentas rodam em modo de ensaio e não gravam nada.

### Modo simulado

No relatório real, quem responde no chat e resume os dias é o Claude. Aqui no GitHub Pages não há modelo de IA por trás: o Bit responde com regras fixas e avisa que a resposta é simulada. Os casos de teste são os mesmos nos dois modos.

## Outras páginas da demo

- **Como foi feito:** a dor, o antes e depois, o fluxo do agente e a divisão de trabalho entre mim e a IA.
- **SQL:** os dados do diário em cinco tabelas, com consultas prontas e um campo para escrever um `SELECT`.
- **Próximas automações:** duas automações projetadas (agenda do Google Workspace e painel de validação a partir do Jira) e um protótipo que classifica os erros do diário e gera um checklist de revisão.

## Testes automatizados (Cypress)

Além dos testes do Bit, a página inteira tem testes end-to-end em [Cypress](https://www.cypress.io/). Eles rodam no GitHub Actions a cada mudança, em tela de computador e de celular, e o selo no topo deste README mostra se estão passando.

| Arquivo | O que verifica |
| --- | --- |
| `01-navegacao` | Cada aba mostra só o seu painel, os links do topo abrem as páginas de bastidores e o aviso de demonstração abre e fecha |
| `02-diario` | Ordem dos dias, busca, chips de tipo, filtros de time e cliente, botão Limpar, expandir e recolher, troca para o calendário |
| `03-cadastro` | Detecção de cliente, squad e tipo pelo texto, salvar um dia novo, editar um dia existente sem duplicar, data obrigatória e nada salvo ao recarregar |
| `04-agenda` | Daily indicada pela OS do dia anterior, reporte agrupado por squad, pergunta do squad de uma OS desconhecida, lembrete que só é removido depois de confirmar |
| `05-bit` | Chat abre e fecha com Esc, responde com os números do relatório e os testes da página do Bit passam |
| `06-sql-e-checklist` | Consultas prontas, recusa de comandos que não são `SELECT` e checklist gerado a partir dos erros |
| `07-tema-e-celular` | Tema escuro e lembrado ao recarregar, sem rolagem horizontal no celular |

Como as datas da demo acompanham o dia de hoje, os testes não usam datas fixas: leem a data da própria página.

## Como rodar

É um único arquivo. Baixe o `index.html` e abra no navegador, ou acesse o link do GitHub Pages acima. Não precisa instalar nada.

Para rodar os testes na sua máquina (precisa do [Node.js](https://nodejs.org/)):

```bash
npm install
npm test          # roda todos os testes no terminal
npm run cy:open   # abre o Cypress para ver os testes rodando
```

## Como foi construído

Construí o relatório com o Claude, por desenvolvimento assistido por IA: eu levantei o problema, defini os requisitos e as regras do Bit, testei cada entrega e pedi as correções; o Claude escreveu o código.

- HTML, CSS e JavaScript, sem framework
- Cypress e GitHub Actions para os testes end-to-end
- [AlaSQL](https://github.com/AlaSQL/alasql) (licença MIT) para as consultas SQL no navegador
- Claude como modelo do agente e dos resumos na versão real

## Autora

Adna Carolinne Torres, estudante de Análise e Desenvolvimento de Sistemas e estagiária de testes de software.
[LinkedIn](https://www.linkedin.com/in/adna-carolinne-torres)
