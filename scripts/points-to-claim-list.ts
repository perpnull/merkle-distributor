import { program } from 'commander'
import fs from 'fs'
import path from "path";

type WeeklyPointFormat = {
    account:string,
    points:string,
    isDoubled:boolean
}

type ClaimFormat = {
    [account: string]: string;
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

const result = parseWeeklyPoints(json);

const outputPath = path.resolve(__dirname, "claim-list.json");
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");

console.log(`Results have been written to ${outputPath}`);


function parseWeeklyPoints(weeklyPoints: WeeklyPointFormat[]): ClaimFormat {

        weeklyPoints = weeklyPoints.filter((p) => Number(p.points) > 0);
        const totalPoints = weeklyPoints.reduce((total, current ) => {
            return total + Number(current.points);
        }, 0);

        const result = weeklyPoints.reduce<ClaimFormat>(
            (acc, current) => {
                const amount = Math.floor(Number(current.points) *  TOKEN_AMOUNT / totalPoints);
                acc[current.account] = amount.toString();
                return acc;
            }, {}
        );

        return result;
}