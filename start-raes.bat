@echo off
cd /d C:\Users\Pranee\Downloads\raescbe
start "Raes Backend" cmd /k "npm --prefix backend run start"
start "Raes Frontend" cmd /k "npm --prefix frontend run dev"
