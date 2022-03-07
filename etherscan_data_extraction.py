# CREDIT TO TECH WITH TIM, source: https://www.youtube.com/watch?v=x5FHbr0Em5A

from requests import get
from matplotlib import pyplot as plt
from datetime import datetime

API_KEY = "IZPJJQ8EBZI11YDKQ27YSUCNNEIYPIHHH4"
ETH_VALUE = 10 ** 18
BASE_URL = "https://api.etherscan.io/api"


def make_api_url(module, action, adress, **kwargs):
    # kwargs = {'tag': 'latest', 'x': '2'}
    url = (
        BASE_URL + f"?module={module}&action={action}&address={adress}&apikey={API_KEY}"
    )
    for key, value in kwargs.items():  # add the kwargs arguments
        url += f"&{key}={value}"
    return url


def get_value_between_logs(address):
    results = []
    get_logs_url = make_api_url(
        "logs",
        "getLogs",
        address,
        fromBlock=14247617,
        toBlock="latest",
        topic1="0x0000000000000000000000009bfb385c1adb607a427183bd3eb7dc687f639f26",
        topic1_2_opr="and",
        topic2="0x0000000000000000000000009a315bdf513367c0377fb36545857d12e85813ef",
    )
    response = get(get_logs_url)
    data = response.json()["result"]

    for tx in data:
        ammount = int(tx["data"], 16) / ETH_VALUE
        block_number = int(tx["blockNumber"], 16)
        dt_object = datetime.fromtimestamp(int(tx["timeStamp"], 16))
        time = dt_object.strftime("%m/%d/%Y, %H:%M:%S")
        transaction = tx["transactionHash"]
        final_log = {
            "ammount": ammount,
            "block_number": block_number,
            "Time": time,
            "Transaction": transaction,
        }

        results.append(final_log)
    print(results)


address = "0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44"

get_value_between_logs(address)
