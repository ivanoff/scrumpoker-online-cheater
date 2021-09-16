# Scrumpoker-online Estimation Auto Submitter

## aka. Scrumpoker-online Cheater

This script automatically submits the most common estimate in scrumpoker-online.org's room.

Just start script and wait for others to submit estimations. Example of output:

```
John Deer submited 5
=== WE SUBMIT 5
Bob submited 100
Alice submited 100
=== WE SUBMIT 100
```

![variables](/static/1.png)


## Instalation

```git clone https://github.com/ivanoff/scrumpoker-online-cheater.git```

```cd scrumpoker-online-cheater```

```npm install```

Edit `.env` ([Where to get .env variables](#where-to-get-env-variables))

```npm start```


## Example Output

```
=== Ready ===
{
  S40pKAnnTmghqZCZUArLbQJH2iA3: 'Alice',
  zePraHP46FRf6z5gvRRcfILARVh2: 'Bob'
}
```

Open `https://www.scrumpoker-online.org/en/room/637497/scrum-poker` and submit any estimate

```
Alice submited 3
=== WE SUBMIT 3
Alice submited 100
=== WE SUBMIT 100
```


## Where to get .env variables

In `Chrome` open scrumpoker-online room (ex. https://www.scrumpoker-online.org/en/room/637497/scrum-poker)

Press `F12`, and then `F5`

1. Select `WS`

2. Click on url

3. Click on `Messages`

All variables are on the screenshot below

![variables](/static/2.png)


## Created by

Dimitry Ivanov <2@ivanoff.org.ua> # curl -A cv ivanoff.org.ua
