tentei limpar um pouco o LSXscene. 

Criei a classe Graph para armazenar todos os arrays gerados pelo myscenegraph, estando declarado na LSXscene.

Mudei a estrutura das luzes. quando elas sao lidas, modificam os array das luzes default e criam depois uma LIGHT que se junta a um array, onde vao armazenar o id da light a que corresponde, o id e o enable

o maior problema neste momento sao as luzes que nao ativam nos outros projetos,  nao sei pq... e as texturas estao bem mas acho que ainda tem de levar alguma correçao.
em alguns projetos, ainda aparecem solidos transparentes

retirei a interface para nao estar a chatear com aquela lista toda. depois temos de ver um metodo de arranja la para mostrar os id's das luzes que foram criadas
