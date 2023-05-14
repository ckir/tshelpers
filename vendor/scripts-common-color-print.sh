#!/bin/bash

printGray() {
    writeMessageSL " \b"; printf "\e[38;5;8m%s\e[0m" "$1"
    echo ""
}

printRed() {
    writeMessageSL " \b"; printf "\e[38;5;9m%s\e[0m" "$1"
    echo ""
}

printGreen() {
    writeMessageSL " \b"; printf "\e[38;5;10m%s\e[0m" "$1"
    echo ""
}

printYellow() {
    writeMessageSL " \b"; printf "\e[38;5;11m%s\e[0m" "$1"
    echo ""
}

printBlue() {
    writeMessageSL " \b"; printf "\e[38;5;12m%s\e[0m" "$1"
    echo ""
}

printWMagenta() {
    writeMessageSL " \b"; printf "\e[38;5;13m%s\e[0m" "$1"
    echo ""
}

printCyan() {
    writeMessageSL " \b"; printf "\e[38;5;14m%s\e[0m" "$1"
    echo ""
}

printWhite() {
    writeMessageSL " \b"; printf "\e[38;5;15m%s\e[0m" "$1"
    echo ""
}