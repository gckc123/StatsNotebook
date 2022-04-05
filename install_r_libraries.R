lib <- read.csv("r_libraries.csv")

for (i in 1:length(lib$package)) {
  install.packages((lib$package[i]))
}

