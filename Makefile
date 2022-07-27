# gnu make file
# Default makes the necessary files

nodes:=$(wildcard nodes/*.js)

.PHONY : default
default : nodeList.js

nodeList.js : $(nodes)
	bin/updateNodesList > $@

