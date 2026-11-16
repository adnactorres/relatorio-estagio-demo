# Relatório de Estágio com IA (demo)

Versão de demonstração do relatório interativo que eu uso no meu estágio em testes de software (QA). Ele registra o dia a dia, prepara a daily e tem um agente de IA, o **Bit**, que responde perguntas sobre os registros e executa ações na página.

**Ver funcionando:** https://adnactorres.github.io/relatorio-estagio-demo/

> Todos os dados desta demo são fictícios: empresa, clientes, pessoas e ordens de serviço foram inventados, e as datas são recalculadas a partir do dia em que a página é aberta. Nada do que você digitar é salvo.

## O problema

- Meu relatório diário era um texto corrido, difícil de ler e de acompanhar ao longo das semanas.
- Trabalho em ordens de serviço de squads diferentes, com dailies em horários próximos. Toda manhã eu precisava descobrir de qual participar e montar o que dizer.
- Para achar um registro antigo (um erro, um cliente, uma tarefa validada) eu precisava reler tudo.

## O que o relatório faz

| Área | O que tem |
| --- | --- |
| Resumo | Agenda do dia com as dailies, indicação de qual participar pela OS do dia anterior, resumo do último dia, bloqueios, números do estágio e calendário |
| Diário | Um cartão por dia, com busca e filtros por time, cliente e tipo de atividade |
| Cadastro | Formulário que identifica clientes, OS e tipo de atividade a partir do texto |
| Clientes | Dias trabalhados por cliente e por ordem de serviço |
| Acadêmico | Provas e prazos da faculdade |

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

### Testes do Bit

A página **O Bit** traz nove casos de teste, um para cada regra. Ao rodar, cada caso é enviado ao Bit na conversa, ao vivo, e a página confere a resposta e a ferramenta chamada. Durante os testes, as ferramentas rodam em modo de ensaio e não gravam nada.

### Modo simulado

No relatório real, quem responde no chat e resume os dias é o Claude. Aqui no GitHub Pages não há modelo de IA por trás: o Bit responde com regras fixas e avisa que a resposta é simulada. Os casos de teste são os mesmos nos dois modos.

## Outras páginas da demo

- **Como foi feito:** a dor, o antes e depois, o fluxo do agente e a divisão de trabalho entre mim e a IA.
- **SQL:** os dados do diário em cinco tabelas, com consultas prontas e um campo para escrever um `SELECT`.
- **Próximas automações:** duas automações projetadas (agenda do Google Workspace e painel de validação a partir do Jira) e um protótipo que classifica os erros do diário e gera um checklist de revisão.

## Como rodar

É um único arquivo. Baixe o `index.html` e abra no navegador, ou acesse o link do GitHub Pages acima. Não precisa instalar nada.

## Como foi construído

Construí o relatório com o Claude, por desenvolvimento assistido por IA: eu levantei o problema, defini os requisitos e as regras do Bit, testei cada entrega e pedi as correções; o Claude escreveu o código.

- HTML, CSS e JavaScript, sem framework
- [AlaSQL](https://github.com/AlaSQL/alasql) (licença MIT) para as consultas SQL no navegador
- Claude como modelo do agente e dos resumos na versão real

## Autora

Adna Carolinne Torres, estudante de Análise e Desenvolvimento de Sistemas e estagiária de testes de software.
[LinkedIn](https://www.linkedin.com/in/adna-carolinne-torres)
