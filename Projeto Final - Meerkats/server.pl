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