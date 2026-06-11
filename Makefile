.PHONY: run reset check

run:
	python3 server.py --open

reset:
	python3 server.py --reset-data --init-only

check:
	python3 -m py_compile server.py
	python3 server.py --init-only
