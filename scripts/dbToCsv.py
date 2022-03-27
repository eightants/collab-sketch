from pymongo import MongoClient
import os
from dotenv import load_dotenv
import numpy as np
import csv
import math
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


def calculateStrokeLength(points):
    totalLength = 0
    for i in range(len(points) - 1):
        a = points[i]
        b = points[i+1]
        totalLength += math.sqrt((b[0] - a[0])**2 + (b[1] - a[1])**2)
    return totalLength


def calculateStrokeSpeed(timestamps, length):
    return timestamps[len(timestamps) - 1] - timestamps[0]


def calculateStrokeCentroid(points):
    xTotal = 0
    yTotal = 0
    for p in points:
        xTotal += p[0]
        yTotal += p[1]
    return [xTotal / len(points), yTotal / len(points)]


# loads env vars
load_dotenv()

mongokey = os.getenv('MONGO')
print(mongokey)
client = MongoClient(mongokey)
sketchDB = client.get_database('sketch')
roomsDB = sketchDB.get_collection("rooms")

roomsToProcess = ["102", "256", "398"]
header = ["userId", "timestamp", "strokeLength",
          "strokeSpeed", "strokeCentroidX", "strokeCentroidY", "numberOfSegments"]
statsHeader = ["userId", "strokeLengthSD", "strokeLengthAvg", "strokeSpeedSD", "strokeSpeedAvg", "numSegmentsAvg", "locationAvg", "locationSD", "sequenceInGroup",
               "boundingX", "boundingY", "numStrokes", "timestampAvg", "timestampSD", "timestampMin", "timestampMax", "timestampMedian", "timestampUpper", "timestampLower", "score"]


for roomId in roomsToProcess:
    room = roomsDB.find_one({"_id": roomId})

    data = []
    for path in room["paths"]:
        userId = path["id"]
        timestamp = path["time"]
        strokeColor = "black" if len(path["timeStamps"]) and path["path"][1]["strokeColor"][0] == 0 else "white"
        if strokeColor == "black":
            strokeLength = calculateStrokeLength(path["path"][1]["segments"])
            strokeSpeed = calculateStrokeSpeed(
                path["timeStamps"], strokeLength)
            strokeCentroid = calculateStrokeCentroid(path["path"][1]["segments"])
            strokeCentroidX = strokeCentroid[0]
            strokeCentroidY = strokeCentroid[1]
            numberOfSegments = len(path["path"][1]["segments"])
            data.append([userId, timestamp, strokeLength,
                         strokeSpeed, strokeCentroidX, strokeCentroidY, numberOfSegments])
    roomData = pd.DataFrame(data, columns=header)

    for user in roomData["userId"].unique():
        print(roomData[roomData["userId"] == user].min())
        roomData.loc[roomData["userId"]==user,"timestamp"] -= roomData[roomData["userId"] == user]['timestamp'].min()

    for k, v in userEvaluations.items():
        roomData.loc[roomData['userId'] == k, 'rank'] = v['rank']
    
    if roomId == "398":
        roomData.loc[roomData["userId"]=="839","timestamp"] -= 300000

    print(roomData)
    roomData.to_csv(path_or_buf="./scripts/" + roomId + ".csv", index=False)


print("completed")
