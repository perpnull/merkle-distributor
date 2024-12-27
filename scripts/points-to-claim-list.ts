import { program } from 'commander'
import fs from 'fs'
import { parseBalanceMap } from '../src/parse-balance-map'
import { BigNumber } from 'ethers'

type WeeklyPointFormat = {
    account:string,
    points:string,
    isDoubled:boolean
}

type ClaimFormat = {
    account:string,
    amount: number
}

const TOKEN_AMOUNT: number = 10000000;

program
  .version('0.0.0')
  .requiredOption(
    '-i, --input <path>',
    'input JSON file location containing a map of account addresses to string balances'
  )

program.parse(process.argv)

const json = JSON.parse(fs.readFileSync(program.input, { encoding: 'utf8' }))

if (typeof json !== 'object') throw new Error('Invalid JSON')

console.log(JSON.stringify(parseWeeklyPoints(json)))


function parseWeeklyPoints(weeklyPoints: WeeklyPointFormat[]): ClaimFormat[] {
        console.log(weeklyPoints);

        weeklyPoints = weeklyPoints.filter((p) => Number(p.points) > 0);
        const totalPoints = weeklyPoints.reduce((total, current ) => {
            return total + Number(current.points);
        }, 0);
        console.log("Total points:", totalPoints);

        const result = weeklyPoints.reduce<ClaimFormat[]>(
            (acc, current) => {
                const amount = Math.floor(Number(current.points) *  TOKEN_AMOUNT / totalPoints);
                acc.push({account:current.account, amount});
                return acc;
            }, []
        );

        console.log(result);

        return [];
}