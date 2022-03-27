import pandas as pd

userEvaluations = {
    "216": {
        "score": 18/5,
        "sequence": 1,
        "rank": 2
    },
    "215": {
        "score": 20/5,
        "sequence": 2,
        "rank": 1
    },
    "217": {
        "score": 14/5,
        "sequence": 3,
        "rank": 4
    },
    "219": {
        "score": 16/5,
        "sequence": 4,
        "rank": 3
    },
    "218": {
        "score": 14/5,
        "sequence": 5,
        "rank": 4
    },
    "278": {
        "score": 21/5,
        "sequence": 1, 
        "rank": 1
    },
    "280": {
        "score": 19/5,
        "sequence": 2,
        "rank": 3
    },
    "281": {
        "score": 21/5,
        "sequence": 3,
        "rank": 1
    },
    "282": {
        "score": 11/5,
        "sequence": 4,
        "rank": 4
    },
    "283": {
        "score": 6/5,
        "sequence": 5,
        "rank": 5
    },
    "838": {
        "score": 10/3,
        "sequence": 1,
        "rank": 3
    },
    "836": {
        "score": 10/3,
        "sequence": 2, 
        "rank": 3
    },
    "839": {
        "score": 11/3,
        "sequence": 3,
        "rank": 2
    },
    "840": {
        "score": 13/3,
        "sequence": 4,
        "rank": 1
    },
    "841": {
        "score": 9/3,
        "sequence": 5,
        "rank": 5
    },
}

groupOne = pd.read_csv("./scripts/102.csv")
groupTwo = pd.read_csv("./scripts/256.csv")
groupThree = pd.read_csv("./scripts/398.csv")
print(groupOne)


groups = [groupOne, groupTwo, groupThree] 

statsHeader = ["userId", "strokeLengthSD", "strokeLengthAvg", "strokeSpeedSD", "strokeSpeedAvg", "numSegmentsAvg", "locationXAvg", "locationXSD", "locationYAvg", "locationYSD", "sequenceInGroup",
               "boundingArea", "numStrokes", "timestampAvg", "timestampSD", "timestampMin", "timestampMax", "timestampMedian", "timestampUpper", "timestampLower", "score", "rank"]
data = []
groupNum = 0
for df in groups:
    groupNum += 1
    print("== DATA MEANS ==")
    dataMeans = df.groupby("userId", as_index=False).mean()
    print(dataMeans)

    print("== DATA SD ==")
    dataSD = df.groupby("userId", as_index=False).std()
    # print(dataSD['strokeLength'].to_numpy()[0])

    # print(dataSD['userId'].to_list())

    print("== timestamp DESC ==")
    timeDesc = df.groupby('userId')["timestamp"].describe().unstack(1)
    print(timeDesc)

    print("== locationX DESC ==")
    centroidX = df.groupby('userId')["strokeCentroidX"].describe().unstack(1)
    print(centroidX)
    print("== locationY DESC ==")
    centroidY = df.groupby('userId')["strokeCentroidY"].describe().unstack(1)
    print(centroidY)

    for i in range(5):
        userId = dataSD['userId'].to_list()[i]
        strokeLengthSD = dataSD['strokeLength'].to_numpy()[i]
        strokeLengthAvg = dataMeans['strokeLength'].to_numpy()[i]
        strokeSpeedSD = dataSD['strokeSpeed'].to_numpy()[i]
        strokeSpeedAvg = dataMeans['strokeSpeed'].to_numpy()[i]
        numSegmentsAvg = dataMeans['numberOfSegments'].to_numpy()[i]

        locationXSD = centroidX['std'].to_numpy()[i]
        locationXAvg = centroidX['mean'].to_numpy()[i]
        locationYSD = centroidY['std'].to_numpy()[i]
        locationYAvg = centroidY['mean'].to_numpy()[i]

        sequenceInGroup = userEvaluations[str(userId)]["sequence"]

        boundingMinX = centroidX['min'].to_numpy()[i]
        boundingMaxX = centroidX['max'].to_numpy()[i]
        boundingMinY = centroidY['min'].to_numpy()[i]
        boundingMaxY = centroidY['max'].to_numpy()[i]
        boundingArea = (boundingMaxX - boundingMinX) * (boundingMaxY - boundingMinY)

        numStrokes = timeDesc['count'].to_numpy()[i]

        timestampSD = timeDesc['std'].to_numpy()[i]
        timestampAvg = timeDesc['mean'].to_numpy()[i]
        timestampMedian = timeDesc['50%'].to_numpy()[i]
        timestampMin = timeDesc['min'].to_numpy()[i]
        timestampMax = timeDesc['max'].to_numpy()[i]
        timestamp25 = timeDesc['25%'].to_numpy()[i]
        timestamp75 = timeDesc['75%'].to_numpy()[i]

        score = userEvaluations[str(userId)]["score"]
        rank = userEvaluations[str(userId)]["rank"]

        data.append([userId, strokeLengthSD, strokeLengthAvg, strokeLengthSD, strokeSpeedAvg, numSegmentsAvg, locationXAvg, locationXSD, locationYAvg, locationYSD, sequenceInGroup,
                    boundingArea, numStrokes, timestampAvg, timestampSD, timestampMin, timestampMax, timestampMedian, timestamp75, timestamp25, score, rank])

finalData = pd.DataFrame(data, columns=statsHeader)
print(finalData)
finalData.to_csv(path_or_buf="./scripts/data.csv", index=False)







