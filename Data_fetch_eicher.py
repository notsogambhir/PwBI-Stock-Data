import os
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, date

TICKER = "EICHERMOT.NS"
PERIOD = "5y"
INTERVAL = "1d"
BARS_PER_DAY = 1        # Daily bars
OUTPUT = r"C:\Users\hp\OneDrive\StockData\Eicher_Stock_Data.xlsx"


# ─────────────────────────────────────────
# FETCH
# ─────────────────────────────────────────
def get_data():
    df = yf.download(TICKER, period=PERIOD, interval=INTERVAL, progress=False)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    df = df.reset_index()
    df.rename(columns={"Datetime": "Datetime", "index": "Datetime"}, inplace=True)

    # Normalise the datetime column name (yfinance may call it Date or Datetime)
    if "Date" in df.columns and "Datetime" not in df.columns:
        df.rename(columns={"Date": "Datetime"}, inplace=True)

    df = df[["Datetime", "Open", "High", "Low", "Close", "Volume"]]
    df["Datetime"] = pd.to_datetime(df["Datetime"]).dt.tz_localize(None)
    return df.dropna().reset_index(drop=True)


# ─────────────────────────────────────────
# INDICATORS
# ─────────────────────────────────────────
def indicators(df):
    close = df["Close"]

    df["Return"] = close.pct_change()
    df["Change"] = close.diff()

    # MAs in daily bars: 20d ≈ 1 month, 50d ≈ 2-3 months, 200d ≈ 1 year
    df["MA20"]  = close.rolling(20).mean()
    df["MA50"]  = close.rolling(50).mean()
    df["MA200"] = close.rolling(200).mean()

    delta = close.diff()
    rs = delta.clip(lower=0).rolling(14).mean() / (-delta.clip(upper=0)).rolling(14).mean()
    df["RSI"] = 100 - (100 / (1 + rs))

    std20 = close.rolling(20).std()
    df["BB_Upper"] = df["MA20"] + 2 * std20
    df["BB_Lower"] = df["MA20"] - 2 * std20

    # 20-day rolling VWAP
    tp = (df["High"] + df["Low"] + df["Close"]) / 3
    df["VWAP"] = (tp * df["Volume"]).rolling(20).sum() / df["Volume"].rolling(20).sum()

    tr = pd.concat([
        df["High"] - df["Low"],
        (df["High"] - close.shift()).abs(),
        (df["Low"]  - close.shift()).abs()
    ], axis=1).max(axis=1)
    df["ATR"] = tr.rolling(14).mean()

    ema12 = close.ewm(span=12, adjust=False).mean()
    ema26 = close.ewm(span=26, adjust=False).mean()
    df["MACD"]        = ema12 - ema26
    df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

    # Annualise: 252 trading days/year
    df["Volatility"] = df["Return"].rolling(30 * BARS_PER_DAY).std() * np.sqrt(252 * BARS_PER_DAY)

    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].round(3)
    return df


# ─────────────────────────────────────────
# RISK METRICS
# ─────────────────────────────────────────
def risk_metrics(df):
    r = df["Return"].dropna()

    # Annualise Sharpe with daily bars
    sharpe = np.sqrt(252 * BARS_PER_DAY) * r.mean() / r.std()

    cum = (1 + r).cumprod()
    dd  = (cum - cum.cummax()) / cum.cummax()
    df["Drawdown"] = dd

    return round(sharpe, 4), round(dd.min(), 4)


# ─────────────────────────────────────────
# MONTHLY
# ─────────────────────────────────────────
def monthly(df):
    m = df.copy()
    m["Month"] = df["Datetime"].dt.to_period("M")

    m = (
        m.groupby("Month")
         .agg(Open=("Open", "first"), High=("High", "max"),
              Low=("Low", "min"),    Close=("Close", "last"),
              Volume=("Volume", "sum"))
         .reset_index()
    )

    m["Return_%"] = (m["Close"] / m["Open"] - 1) * 100
    m["Month"] = m["Month"].astype(str)

    return m.round(2)


# ─────────────────────────────────────────
# DASHBOARD
# ─────────────────────────────────────────
def dashboard(df, sharpe, max_dd):
    latest = df.iloc[-1]
    prev   = df.iloc[-2]

    ytd_start = df[df["Datetime"].dt.date >= date(date.today().year, 1, 1)].iloc[0]["Close"]

    # Daily bar offsets: 1M ≈ 22 days, 3M ≈ 66 days
    bars_1m = 22 * BARS_PER_DAY
    bars_3m = 66 * BARS_PER_DAY

    # 52W in daily bars: 252 days
    bars_52w = 252 * BARS_PER_DAY

    metrics = {
        "Last Updated"  : datetime.now().strftime("%d-%b-%Y %H:%M"),
        "CMP"           : latest["Close"],
        "Change"        : latest["Change"],
        "Change %"      : (latest["Close"] / prev["Close"] - 1) * 100,
        "52W High"      : df["High"].tail(bars_52w).max(),
        "52W Low"       : df["Low"].tail(bars_52w).min(),
        "YTD Return %"  : (latest["Close"] / ytd_start - 1) * 100,
        "1M Return %"   : (latest["Close"] / df.iloc[-bars_1m]["Close"] - 1) * 100,
        "3M Return %"   : (latest["Close"] / df.iloc[-bars_3m]["Close"] - 1) * 100,
        "RSI"           : latest["RSI"],
        "MACD"          : latest["MACD"],
        "MACD Signal"   : latest["MACD_Signal"],
        "ATR"           : latest["ATR"],
        "VWAP"          : latest["VWAP"],
        "Volatility"    : latest["Volatility"],
        "Sharpe Ratio"  : sharpe,
        "Max Drawdown"  : max_dd,
    }

    return pd.DataFrame(metrics.items(), columns=["Metric", "Value"])


# ─────────────────────────────────────────
# SAVE
# ─────────────────────────────────────────
def save(df_stock, df_month, df_dash):
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with pd.ExcelWriter(OUTPUT, engine="openpyxl") as writer:
        df_stock.to_excel(writer, sheet_name="Stock Data",      index=False)
        df_month.to_excel(writer, sheet_name="Monthly Returns", index=False)
        df_dash.to_excel(writer,  sheet_name="Dashboard",       index=False)


# ─────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────
def main():
    print("Downloading data...")
    df = get_data()
    print(f"{len(df)} daily bars  |  {df['Datetime'].min().date()} -> {df['Datetime'].max().date()}")

    print("Computing indicators...")
    df = indicators(df)

    print("Computing risk metrics...")
    sharpe, max_dd = risk_metrics(df)

    print("Monthly aggregation...")
    df_month = monthly(df)

    print("Building dashboard...")
    df_dash = dashboard(df, sharpe, max_dd)

    print("Saving Excel...")
    save(df, df_month, df_dash)

    print("Done.")


if __name__ == "__main__":
    main()