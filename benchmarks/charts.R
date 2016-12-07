#!/usr/bin/env Rscript
require( tikzDevice )
require(gdata)

percent <- function(x, digits = 2, format = "f", ...) {
  ifelse(is.na(x), "", formatC(100 * x, format = format, digits = digits, ...))
}

time <- function (x, ...) {
  ifelse(x < 100, 
         ifelse(x < 10, paste0(formatC(x, format = "f", digits = 2, ...), "s"), paste0(formatC(x, format = "f", digits = 1, ...), "s")),
         paste0(formatC(x, format = "f", digits = 0, ...), "s"))
}

dir.create(file.path("charts"), showWarnings=FALSE)
data <- read.csv("./benchmarks.csv")

computeRelativeMean <- function (record) {
  syncBaseLine <- data[data$OS == record["OS"] & data$OS.Version == record["OS.Version"] & data$Browser == record["Browser"] & data$Browser.Version==record["Browser.Version"] & data$Set == "sync" & data$Name == record["Name"],]
  as.numeric(record["Mean..s."]) / syncBaseLine[1, "Mean..s."]
}

plotChart <- function (plotData, byBrowserVersion, environmentTitle=NULL) {
  colours <- gray.colors(nrow(plotData), start=0.4, end=1)
  numRows <- ifelse(is.null(nrow(plotData)), 1, nrow(plotData))
  barDensity <- c(-10, 40, 25, 0)[1:numRows]
  shadeAngle <- c(0, 45, -45, 0)[1:numRows]
  fontColors <- c("white", "black", "black", "black")[1:numRows]
  
  # Reduce margin, mainly for latex output
  par(mar=c(2,4,2,0))
  bb <- barplot(plotData, beside=TRUE, main=environmentTitle, ylab="Fraction of sequential runtime", col=colours, ylim = c(0, max(1, max(plotData+0.2, na.rm=TRUE))), density = barDensity, angle=shadeAngle)
  if (!is.null(rownames(plotData))) {
    legend("topleft", legend = rownames(plotData), bty="n", fill=colours, density = barDensity, angle=shadeAngle) 
  }
  text(bb, plotData, percent(plotData, digits = 1), pos = 3, cex = 0.8, col="black")
  
  means <- with(byBrowserVersion, {
    out <- matrix(nrow=nlevels(byBrowserVersion$Set), ncol=nlevels(byBrowserVersion$Name),
                  dimnames=list(levels(byBrowserVersion$Set), levels(byBrowserVersion$Name)))
    out[cbind(byBrowserVersion$Set, byBrowserVersion$Name)] <- byBrowserVersion$Mean..s.
    out <- out[rowSums(is.na(out)) != ncol(out), colSums(is.na(out)) != nrow(out), drop=FALSE] 
    out
  })
  
  text(bb, 0, time(means), pos=3, cex=0.8, col=fontColors)
}


data$RelativeMean <- apply(data, 1, computeRelativeMean)
data <- data[!is.na(data$RelativeMean), ]

createCharts <- function (sets, tests, prefix="") {
  relevant <- data[data$Set %in% sets & data$Name %in% tests, ]
  relevant$Set <- reorder.factor(relevant$Set, new.order=sets)

  for(os in unique(relevant$OS)) {
    byOS <- relevant[relevant$OS==os,]
    
    for (osVersion in unique(byOS$OS.Version)) {
      byOSVersion <- byOS[byOS$OS.Version == osVersion, ]
      
      for (browser in unique(byOSVersion$Browser)) {
        byBrowser <- byOSVersion[byOSVersion$Browser==browser, ]
        
        for (browserVersion in unique(byBrowser$Browser.Version)) {
          byBrowserVersion <- byBrowser[byBrowser$Browser.Version==browserVersion, ]
          osName <- paste0(os, " ", osVersion);
          dir.create(file.path("charts", osName), showWarnings=FALSE)
          
          environmentTitle = paste(os, osVersion, browser, browserVersion)
          
          pictureName <- paste0(browser, "-", browserVersion)
          fullName <- paste0("charts/", osName, "/", prefix, pictureName)
        
          tmp <- byBrowserVersion[, c("Set", "Name", "RelativeMean")]
          plotData <- with(tmp, {
            out <- matrix(nrow=nlevels(tmp$Set), ncol=nlevels(tmp$Name),
                          dimnames=list(levels(tmp$Set), levels(tmp$Name)))
            out[cbind(tmp$Set, tmp$Name)] <- tmp$RelativeMean
            out <- out[rowSums(is.na(out)) != ncol(out), colSums(is.na(out)) != nrow(out), drop=FALSE]
            out
          })
          
          png(paste0(fullName, ".png"), height=16, width=ncol(plotData) * 9, units="cm", res=300)
          plotChart(plotData, byBrowserVersion, environmentTitle)
          dev.off()
          
          svg(paste0(fullName, ".svg"), height=6.29921, width=ncol(plotData) * 3.54331)
          plotChart(plotData, byBrowserVersion, environmentTitle)
          dev.off()
          
          latexWidth = ifelse(ncol(plotData) > 2, 6.85135, 3.34065)
          
          tikz(paste0(fullName, ".tex"), height=2.9, width=latexWidth, sanitize = TRUE, engine="pdftex")
          plotChart(plotData, byBrowserVersion)
          dev.off()
        }
      }
    }
  }  
}

createCharts(
 c("Parallel.es", "Hamsters.js", "Parallel.js", "Threads.js"),
 c("Knights Tour (5x5)", "Knights Tour (6x6)", "Mandelbrot", "Riskprofiling")
)

createCharts(
  c("Parallel.es", "Hamsters.js", "Parallel.js", "Threads.js"),
  c("Knights Tour (5x5)"),
  "knight-tour-5x5"
)

# createCharts(
#  c("parallel-dynamic", "hamstersjs"), 
#  c("Monte Carlo Math.random 100k", "Monte Carlo Math.random 1m"),
#  "Monte Carlo simjs"
#)

#createCharts(
#  c("parallel-es", "paralleljs", "threadsjs"), 
#  c("Monte Carlo simjs 100k", "Monte Carlo simjs 1m"),
#  "Monte Carlo Math.random"
#)

