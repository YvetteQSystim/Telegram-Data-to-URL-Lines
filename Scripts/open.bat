# 使用默认浏览器打开 URL 地址
@echo off

# 循环打开网址
for /f "tokens=*" %%i in (pages.txt) do (start %%i )

# 清空 pages.txt
# 防止记不清 pages.txt 里面的网址有没有批量打开过
echo.>pages.txt

# 退出
exit