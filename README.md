# MDS/86 Legacy Terminal

Uma experiência web interativa inspirada em **terminais antigos, sistemas legados e computadores das décadas de 80 e 90**.

O **MDS/86** transforma uma página simples em uma pequena experiência narrativa. O visitante entra sem saber exatamente o que vai acontecer e é recebido por um sistema aparentemente antigo que começa a identificá-lo, analisá-lo e reagir às suas decisões.

```text
MANDUCA SYSTEMS CORPORATION
MDS/86 COMPATIBLE SYSTEM

MEMORY TEST: 640K ........ OK

INITIALIZING I/O........... OK
LOADING CORE............... OK
CHECKING TERMINAL.......... OK
REMOTE SESSION............. ESTABLISHED
```

## Sobre

O projeto nasceu da ideia de colocar um link misterioso em um perfil e entregar algo completamente diferente para quem decidir clicar.

Em vez de uma página tradicional, o visitante encontra uma interface inspirada em antigos terminais CRT.

O sistema passa por uma sequência de inicialização, solicita a identificação do visitante e começa uma suposta busca em seus registros.

```text
SEARCHING LOCAL INDEX...

████░░░░░░░░░░░░  24%
█████████░░░░░░░  57%
████████████████  100%

MATCHING RECORD............. YES
VERIFYING SUBJECT........... OK

!!! TARGET FOUND !!!
```

A partir daí, a experiência passa a interagir diretamente com o visitante.

O restante é melhor descobrir entrando no sistema.

## Experiência

O MDS/86 possui elementos inspirados em interfaces e computadores antigos:

- Terminal com fósforo verde
- Estética CRT
- Scanlines
- Ruído analógico
- Cursor em bloco
- Animações de digitação
- Glitches e interferências
- Sons de sistema
- Interface em português e inglês
- Scanner ASCII
- Respostas interativas
- Easter eggs
- Experiência especial em acessos futuros
- Adaptação para desktop e celular

## Sistema

Toda a experiência acontece diretamente no navegador.

O projeto utiliza:

```text
HTML5
CSS3
JavaScript
LocalStorage
Web Audio API
```

Não existe backend ou banco de dados externo envolvido na experiência.

## Persistência

O sistema consegue reconhecer quando alguém já completou a experiência anteriormente.

Isso permite que uma segunda visita seja diferente da primeira.

```text
BOOT OK.

...

WAIT.

SUBJECT RECORD EXISTS.

Welcome back.

Você não aprendeu da primeira vez?
```

Essa informação é armazenada apenas localmente no próprio navegador através do `localStorage`.

## Privacidade

Apesar da aparência propositalmente suspeita, **nenhum scanner real é executado**.

O MDS/86 não acessa localização, arquivos, senhas, câmera, contatos ou informações privadas do dispositivo.

Elementos como:

```text
TARGET FOUND
SEARCHING DATABASE
ANALYZING SUBJECT
THREAT LEVEL
```

fazem parte exclusivamente da narrativa da aplicação.

## Objetivo

O MDS/86 não foi criado para resolver um problema.

Foi criado simplesmente para proporcionar alguns minutos de curiosidade, tensão e humor para alguém que decidiu clicar em um link sem saber onde ele levaria.

E talvez provar uma coisa:

```text
CURIOSIDADE: 100%
```

---

```text
SESSION TERMINATED.
THANK YOU FOR PARTICIPATING.

MDS/86 SYSTEM
made by manduca.
```
