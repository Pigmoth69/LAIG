:- include('project/reader/plog/meerkats.pl').
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_path)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_server_files)).

:- use_module(library(lists)).

:- http_handler(root(game), prepReplyStringToJSON, []).
:- http_handler(project(.), serve_files_in_directory(project), [prefix]).
http:location(project, root(project), []).
user:file_search_path(document_root, '.').
user:file_search_path(project, document_root(project)).

server(Port) :- http_server(http_dispatch, [port(Port)]).

%Receive Request as String via POST
prepReplyStringToJSON(Request) :-
		member(method(post), Request), !,
        http_read_data(Request, Data, []),
		processString(Data).

prepReplyStringToJSON(_Request) :-
		format('Content-type: text/plain~n~n'),
		write('Can only handle POST Requests'),
		format('~n').

formatAsJSON(Reply):-
		format('Content-type: application/json~n~n'),
		writeJSON(Reply).

writeJSON([Val]):-
		write(Val).
writeJSON([Val|VT]):-
		write(Val), write(';'),
		writeJSON(VT).

processString([_Par=Val]):-
        term_string(List, Val),
		Term =.. List,
		Term.

%---------------------------------------------
sortColors([Players], [Bots], Result):-
	atom_number(Players, NumberPlayers),
	atom_number(Bots, NumberBots),
	availableColors(Colors),
	assignBOTColor(NumberBots,Colors,5,FinalBOTsInfo,ResultColors),
	assignPlayerColor(NumberPlayers, ResultColors, 1, FinalPlayersInfo,_),
	append(FinalBOTsInfo, FinalPlayersInfo, Result),
	formatAsJSON([Result]).
%---------------------------------------------	
validDragPositions(Row, Col, Board, Result):-
	registBoard(R),
	validDragLeft(Row, Col, Board, R, R1),
	validDragRight(Row, Col, Board, R1, R2),
	validDragUpLeft(Row, Col, Board, R2, R3),
	validDragUpRight(Row, Col, Board, R3, R4),
	validDragDownLeft(Row, Col, Board, R4, R5),
	validDragDownRight(Row, Col, Board, R5, Result),
	formatAsJSON([Result]).

validDragLeft(Row, Col, Board, Register, FinalRegister):-
	PrevCol is Col - 1,
	getInfo(Row, PrevCol, 0, Board),
	setInfo(Row, PrevCol, 1, Register, Temp),
	validDragLeft(Row, PrevCol, Board, Temp, FinalRegister).
validDragLeft(_, _, _, Register, Register).

validDragRight(Row, Col, Board, Register, FinalRegister):-
	NextCol is Col + 1,
	getInfo(Row, NextCol, 0, Board),
	setInfo(Row, NextCol, 1, Register, Temp),
	validDragRight(Row, NextCol, Board, Temp, FinalRegister).
validDragRight(_, _, _, Register, Register).

validDragUpLeft(Row, Col, Board, Register, FinalRegister):-
	Row > 5,
	PrevRow is Row - 1,
	getInfo(PrevRow, Col, 0, Board),
	setInfo(PrevRow, Col, 1, Register, Temp),
	validDragUpLeft(PrevRow, Col, Board, Temp, FinalRegister).
validDragUpLeft(Row, Col, Board, Register, FinalRegister):-
	Row < 6,
	PrevCol is Col - 1,
	PrevRow is Row - 1,
	getInfo(PrevRow, PrevCol, 0, Board),
	setInfo(PrevRow, PrevCol, 1, Register, Temp),
	validDragUpLeft(PrevRow, PrevCol, Board, Temp, FinalRegister).
validDragUpLeft(_, _, _, Register, Register).

validDragUpRight(Row, Col, Board, Register, FinalRegister):-
	Row > 5,
	PrevRow is Row - 1,
	NextCol is Col + 1,
	getInfo(PrevRow, NextCol, 0, Board),
	setInfo(PrevRow, NextCol, 1, Register, Temp),
	validDragUpRight(PrevRow, NextCol, Board, Temp, FinalRegister).
validDragUpRight(Row, Col, Board, Register, FinalRegister):-
	Row < 6,
	PrevRow is Row - 1,
	getInfo(PrevRow, Col, 0, Board),
	setInfo(PrevRow, Col, 1, Register, Temp),
	validDragUpRight(PrevRow, Col, Board, Temp, FinalRegister).
validDragUpRight(_, _, _, Register, Register).

validDragDownLeft(Row, Col, Board, Register, FinalRegister):-
	Row < 5,
	NextRow is Row + 1,
	getInfo(NextRow, Col, 0, Board),
	setInfo(NextRow, Col, 1, Register, Temp),
	validDragDownLeft(NextRow, Col, Board, Temp, FinalRegister).
validDragDownLeft(Row, Col, Board, Register, FinalRegister):-
	Row > 4,
	NextRow is Row + 1,
	PrevCol is Col - 1,
	getInfo(NextRow, PrevCol, 0, Board),
	setInfo(NextRow, PrevCol, 1, Register, Temp),
	validDragDownLeft(NextRow, PrevCol, Board, Temp, FinalRegister).
validDragDownLeft(_, _, _, Register, Register).

validDragDownRight(Row, Col, Board, Register, FinalRegister):-
	Row < 5,
	NextRow is Row + 1,
	NextCol is Col + 1,
	getInfo(NextRow, NextCol, 0, Board),
	setInfo(NextRow, NextCol, 1, Register, Temp),
	validDragDownRight(NextRow, NextCol, Board, Temp, FinalRegister).
validDragDownRight(Row, Col, Board, Register, FinalRegister):-
	Row > 4,
	NextRow is Row + 1,
	getInfo(NextRow, Col, 0, Board),
	setInfo(NextRow, Col, 1, Register, Temp),
	validDragDownRight(NextRow, Col, Board, Temp, FinalRegister).
validDragDownRight(_, _, _, Register, Register).


%---------------------------------------------	
validDropPositions(Board, Result):-
	validDropPositionsPL(Board, Result),
	formatAsJSON([Result]).

validDropPositionsPL([], []).
validDropPositionsPL([0 | Tail], [0 | RTail]):-
	validDropPositionsPL(Tail, RTail).
validDropPositionsPL([Head | Tail], [RHead | RTail]):-
	is_list(Head),
	validDropPositionsPL(Head, RHead),
	validDropPositionsPL(Tail, RTail).
validDropPositionsPL([_ | Tail], [1 | RTail]):-
	validDropPositionsPL(Tail, RTail).

play(Player, Board, Play, NextPlayer, NewBoard, Message):-
	% Game Logic
	Board=[[_|A]|B], NewBoard=[[Play|A]|B],
	next(Player, NextPlayer),
	Message = "Move Validated",
	formatAsJSON([NextPlayer, NewBoard, Message]).

next(1,0).
next(0,1).

:- server(8081).