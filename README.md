## Marcador de reunião internacional

A aplicação atende o seguinte escopo:

A MaxMilhas está caminhando para um mercado internacional e acaba sendo necessário o agendamento de reuniões entre locais internacionais. O problema é que cada país tem um fuso horário próprio e temos dificuldade de encontrar uma boa hora para a reunião no horário comercial entre os países envolvidos.

Precisamos de uma ferramenta em que possamos inserir uma data e dois locais para a reunião. Após informado, a tela deve mostrar o horário MAIS CEDO possível para as duas regiões dentro do horário comercial (entre 9hrs e 18hrs). Quando não for possível marcar uma reunião em horário comercial entre os dois locais, por favor, mostre uma mensagem informando a indisponibilidade.

Para lhe guiar, fizemos um layout de como imaginamos essa tela. Sinta-se livre em alterar o design como preferir, mas temos alguns requisitos abaixo que são muito importantes para ficarmos contentes com a ferramenta. Vamos deixar também alguns exemplos de situações para ilustrar melhor nossa ideia.

API’s sugeridas: Google Place
https://developers.google.com/maps/documentation/javascript/places-autocomplete?hl=pt-br
API key: AIzaSyAPbTIwcRFCxFIALB4ayDB96lEA6wpJK-U

Google Timezones API
https://developers.google.com/maps/documentation/timezone/intro?hl=pt-br
API key: AIzaSyBdKcOOJljK0GCbqaM5EzsSkJorY7ZLsFo

Requisitos do campo Data

Não pode selecionar finais de semana
Não pode selecionar dias anteriores a data atual
Não pode selecionar datas após um ano da data atual
O formato deve ser dd/mm/aaaa
Requisitos do campo de Cidade

Ter no mínimo a possibilidade de informar dois locais
Ser integrado com a api de Google Places
Calcular horários quando sair do campo ou selecionar uma cidade.
Requisitos da visualização dos horários

Deve ser informado qual o horário local para cada um dos locais.
O formato de cada linha deve seguir de:
Nome do local - dd/mm/yyyy HH:MM*
*O formato para os horários deve ser de AM-PM. Ex: 17 horas de um local, deve mostrar 5PM.
Pontos positivos do teste:

Javascript utilizando framework AngularJS ou VueJS
CSS gerado pelo pré-compilador SASS
Minificação de arquivos CSS e JS
Acoplamento de arquivos CSS e JS em bundles
Acabamento do layout
Mensagens de feedback quando tem campos faltando ou inválidos
Teste unitários do JS
Utilizar e estar correto com o JSHint e JSCS
Seleção de data através de um Datepicker
Ex. 1:
Data: 15/03/2017
Local 1: Londres
Local 2: Cuiabá
Melhor horário para reunião vai ser: Londres: 1PM e Cuiabá: 9AM

*O gerente do projeto disse que não é obrigatório mas ficaria muito feliz se fosse considerado o horário de verão de cada lugar.

Ex. 2:
Data: 01/01/2018
Local 1: Belo Horizonte
Local 2: Salvador
Melhor horário para reunião vai ser: Belo Horizonte: 10AM e Salvador: 9AM

Ex. 3:
Data: 13/04/2017
Local 1: Belo Horizonte
Local 2: Salvador
Melhor horário para reunião vai ser: Belo Horizonte: 9AM e Salvador: 9AM