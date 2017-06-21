ScottsdaleYard


# Provisioning the DynamoDB locally #
```aws dynamodb create-table --table-name ScottsdaleYard --key-schema AttributeName=UserID,KeyType=HASH --attribute-definitions AttributeName=UserID,AttributeType=S --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000```

# Running the DynamoDB locally #
From command line (does not work in PowerShell)
```java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -inMemory```

# Querying/checking local DB #
List tables:
```aws dynamodb list-tables  --endpoint-url http://localhost:8000```
List rows in table:
```aws dynamodb scan --table-name ScottsdaleYard  --endpoint-url http://localhost:8000```
