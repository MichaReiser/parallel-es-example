percent <- function(x, digits = 2, format = "f", ...) {
  paste0(formatC(100 * x, format = format, digits = digits, ...), "%")
}
dir.create(file.path("charts"), showWarnings=FALSE)
data <- read.csv("./benchmarks.csv")

computeRelativeMean <- function (record) {
  syncBaseLine <- data[data$OS == record["OS"] & data$OS.Version == record["OS.Version"] & data$Browser == record["Browser"] & data$Browser.Version==record["Browser.Version"] & data$Set == "sync" & data$Name == record["Name"],]
  as.numeric(record["Mean..s."]) / syncBaseLine[1, "Mean..s."]
}


data$RelativeMean <- apply(data, 1, computeRelativeMean)
data <- data[!is.na(data$RelativeMean), ]


createCharts <- function (sets, tests) {
  relevant <- data[data$Set %in% sets & data$Name %in% tests, ]

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
          
          notSync <- byBrowserVersion[byBrowserVersion$Set!="sync", ]
          
          pictureName <- paste0(browser, "-", browserVersion, ".png")
          fullName <- paste0("charts/", osName, "/", pictureName)
        
          tmp <- byBrowserVersion[, c("Set", "Name", "RelativeMean")]
          plotData <- with(tmp, {
            out <- matrix(nrow=nlevels(tmp$Set), ncol=nlevels(tmp$Name),
                          dimnames=list(levels(tmp$Set), levels(tmp$Name)))
            out[cbind(tmp$Set, tmp$Name)] <- tmp$RelativeMean
            out <- out[rowSums(is.na(out)) != ncol(out),]
            out <- out[, colSums(is.na(out)) != nrow(out)]
            out
          })
          
          colours <- gray.colors(nrow(plotData), end=0.8)
          
          # Remove to plot to ploting area    
          png(fullName, height=16, width=ncol(plotData) * 9, units="cm", res=300)
          bb <- barplot(plotData, beside=TRUE, main=environmentTitle, ylab="Relative to Sync (%)", col=colours, ylim = c(0, max(1, max(plotData, na.rm=TRUE))))
          legend("topleft", legend = rownames(plotData), bty="n", fill=colours)
          text(bb, 0, percent(plotData, digits = 1), pos = 3, cex = 0.8, col="white")
          
          # ...and this...
          dev.off()
        }
      }
    }
  }  
}

createCharts(
  c("parallel-es", "hamstersjs", "threadsjs", "paralleljs"),
  c("Knights Tour (5x5)", "Knights Tour (6x6)", "Mandelbrot 10000x10000, 1000", "Monte Carlo")
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

