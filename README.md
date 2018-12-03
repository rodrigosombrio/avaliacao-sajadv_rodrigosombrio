# Avaliação SAJAD Rodrigo Sombrio

## Iniciando

Primeiramente você precisa descompactar o arquivo **avaliacao-sajad_rodrigosombrio.zip** numa pasta local. O projeto foi elaborando no sistema operacional Windows, com o banco Mysql, utilizando o Spring Boot e Semantic UI como frameworks.  

### Pré-requisitos

Para executar o projeto localmente é necessário ter instalado: 

* [Mysql 5.5 ou superior](https://dev.mysql.com/downloads/mysql/) - Banco de dados da aplicação
* [Java JDK 8](https://www.oracle.com/technetwork/pt/java/javase/downloads/index.html) - JAVA JDK 1.8
* [Maven 3.5.4](https://www-eu.apache.org/dist/maven/maven-3/3.5.4/binaries/) - Gerenciamento do projeto e dependencias

### Iniciando o ambiente

Para iniciar o projeto é necessário está com o Mysql iniciado, com a variável JAVA_HOME como variável de ambiente e o JAVA e o MAVEN incluidos no PATH da sua máquina.

1) Verificando se o Mysql está iniciado

```
Clique no Iniciar do Windows -> Ferramentas Administrativas -> Serviços
Procurar pelo serviço Mysql e verificar se está iniciado
```

2) Incluido a váriavel JAVA_HOME como variável de ambiente

```
Clique no Iniciar do Windows -> clique com o botão direito sobre a opção Meu Computador -> Propriedades
Clicar na opção Configurações Avançadas do Sistema -> Variáveis de Ambiente
Clique no botão Nova em Variaveis do Sistema e informe o nome "JAVA_HOME" com o valor o diretório onde foi instalado o JAVA 
```

3) Incluido o JAVA_HOME e MAVEN no PATH da máquina

```
Clique no Iniciar do Windows -> clique com o botão direito sobre a opção Meu Computador -> Propriedades
Clicar na opção Configurações Avançadas do Sistema -> Variáveis de Ambiente
Procure a variável Path em Variaveis do Sistema, clique em Editar e informe o diretório de instalação do JAVA <diretorio de instalacao>\bin e o diretório de instalação do Maven <diretorio de instalacao>\bin  
```

## Testando o ambiente

Para verificar se o seu ambiente está configurado acesse o Prompt de Comando através do Iniciar do Windows.

Execute o comando

```
java -version
```

É preciso retornar a versão do JAVA instalada, caso não retorne é necessário verificar a instalação e o Path do Windows se está apontando para a pasta correta do JAVA.
 
Execute o comando

```
mvn --version
```

É preciso retornar a versão do MAVEN instalada, caso não retorne é necessário verificar a instalação e o Path do Windows se está apontando para a pasta correta do MAVEN.


## Iniciando o projeto

Antes de iniciar o projeto é necessário realizar alguns procedimentos:

#### Criar um banco de dados para o projeto
Acesse o Mysql Command Line no menu Iniciar do Windows e informe a senha que você definiu para o root na instalação do Mysql.
No Command Line digite:

```
create database <nome>;
```

#### Alterar arquivo de configuração
Dentro do projeto edite o arquivo application.properties na pasta src\main\resources

```
Altere a linha spring.datasource.url onde:
<host> = nome da maquina ou ip onde está instalado o Mysql
<port> = porta do Mysql  
<database> = nome do banco de dados criado
Altere a linha spring.datasource.username onde:
<user> = usuário de conexão do Mysql
Altere a linha spring.datasource.password onde:
<password> = senha de conexão do Mysql
```

Por padrão a aplicação irá subir na porta 8080, caso queira alterar mude a linha server.port nesse arquivo com a porta desejada. 
 
### Compilando

Acesse o Prompt de Comando no menu Iniciar do Windows e digite:

```
cd <pasta onde o projeto foi descompactado>
```

Para compilar utilize o comando:

```
mvn clean install
```

Nesse ponto o Maven irá compilar e executar o teste na aplicação, ao final deverá aparecer a mensagem BUILD SUCCESS

### Iniciando

Para iniciar o projeto utilize o comando dentro da pasta do projeto:

```
mvn spring-boot:run
```

Pronto o projeto pode ser acessado através do Chrome no endereço "http://localhost:8080" ou na porta que você definiu no arquivo application.poroperties

## Créditos

Rodrigo Sombrio

