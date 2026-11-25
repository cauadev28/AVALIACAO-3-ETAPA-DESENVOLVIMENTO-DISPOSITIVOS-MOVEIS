# CuidaMed - Controle de Medicamentos

Aplicativo mobile desenvolvido como projeto final da disciplina de Desenvolvimento para Dispositivos Móveis.

O CuidaMed ajuda no controle diário de medicamentos, evitando esquecimentos e confusões com dosagens. Dá pra cadastrar cada remédio com nome, dosagem e horário, marcar quando tomou, fotografar a caixa ou receita e acompanhar tudo num painel de resumo.

## Funcionalidades

- Cadastro de medicamentos com nome, dosagem, horário e tipo de uso (contínuo, temporário, urgente)
- Listagem dos medicamentos usando FlatList
- Visualização dos detalhes de cada medicamento
- Edição das informações de um medicamento
- Exclusão de medicamentos com confirmação
- Marcar e desmarcar medicamento como tomado
- Tirar foto da caixa do remédio ou receita médica com a câmera
- Selecionar imagem da galeria do dispositivo
- Busca por nome ou dosagem
- Filtros rápidos (Todos, Pendentes, Tomados)
- Barra de progresso de doses tomadas
- Persistência dos dados (tudo salvo localmente)
- Validação dos campos obrigatórios
- Tela de resumo com estatísticas e informações do app
- Navegação entre telas com tabs e stack
- Interface com tema de saúde e ícones SVG vetoriais

## Mecanismo de persistência

AsyncStorage - os dados são salvos em formato JSON no armazenamento local do dispositivo. Quando o app abre, ele recupera automaticamente os medicamentos que foram salvos anteriormente.

## Recurso nativo implementado

Camera e galeria de imagens usando expo-image-picker. O app pede permissão ao usuário e trata o caso de permissão negada mostrando um alerta explicativo. É possível tirar foto direto pela câmera (da caixa do remédio, bula ou receita médica) ou escolher uma imagem que já está no celular.

## Como instalar e rodar

Primeiro, tenha o Node.js e o Expo CLI instalados.

1. Clone o repositório
2. Entre na pasta do projeto
3. Rode npm install
4. Rode npx expo start
5. Escaneie o QR code com o Expo Go no celular ou rode no emulador

## Bibliotecas utilizadas

- react-native (core do projeto)
- expo (plataforma de desenvolvimento)
- expo-image-picker (câmera e galeria)
- @react-native-async-storage/async-storage (persistência local)
- react-native-svg (ícones vetoriais em SVG)
- @react-navigation/native (navegação)
- @react-navigation/native-stack (navegação stack)
- @react-navigation/bottom-tabs (navegação por abas)
- react-native-screens (otimização de telas)
- react-native-safe-area-context (área segura)
- typescript (tipagem)
