import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("./scripts/data.csv")
print(df)

selectedFeatures = df[["strokeLengthSD", "strokeLengthAvg", "strokeSpeedSD", "strokeSpeedAvg", "numSegmentsAvg", "locationXAvg", "locationXSD", "locationYAvg", "locationYSD", "sequenceInGroup",
               "boundingMinX", "boundingMinY", "boundingMaxX", "boundingMaxY", "numStrokes", "timestampAvg", "timestampSD", "timestampMin", "timestampMax", "timestampMedian", "timestampUpper", "timestampLower", 'score']].copy()

# PLOTTING

# correlation

plt.figure(figsize=(16, 6))

# Set the range of values to be displayed on the colormap from -1 to 1, and set the annotation to True to display the correlation values on the heatmap.
heatmap = sns.heatmap(df.corr(), vmin=-1, vmax=1, annot=True)

# Give a title to the heatmap. Pad defines the distance of the title from the top of the heatmap.
heatmap.set_title('Correlation Heatmap', fontdict={'fontsize':12}, pad=12);

plt.savefig('./scripts/heatmap.png', dpi=300, bbox_inches='tight')