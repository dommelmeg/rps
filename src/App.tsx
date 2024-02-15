import { useState, useEffect } from "react";
import "./App.css";
import {
  Flex,
  Heading,
  List,
  ListItem,
  Select,
  Text,
  VStack,
  Card,
  CardHeader,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {
  // @ts-ignore
  const [computerChoice, setComputerChoice] = useState("");
  const [playerChoice, setPlayerChoice] = useState("");
  const [toolLocked, setToolLocked] = useState(false);

  const { data: allTools } = useQuery({
    queryKey: ["allTools"],
    queryFn: () => {
      return axios.get("https://rps101.pythonanywhere.com/api/v1/objects/all");
    },
  });

  const { data: results, refetch } = useQuery({
    queryKey: ["results"],
    queryFn: () => {
      return axios.get(
        `https://rps101.pythonanywhere.com/api/v1/match?object_one=${playerChoice}&object_two=${computerChoice}`
      );
    },
    enabled: false,
  });

  const handleToolLock = () => {
    const random = Math.floor(Math.random() * allTools?.data.length);
    setComputerChoice(allTools?.data[random]);
    setToolLocked(true);
  };

  // @ts-ignore
  const handleToolSelect = (e) => {
    setPlayerChoice(e.target.value);
  };

  return (
    <Flex h="100vh">
      <VStack>
        <Heading>Rock, Paper, Scissors!</Heading>
        {/* {setGameResults.length > 0 && <Text>{gameResults}</Text>} */}
        {!toolLocked && (
          <Select
            mt="4"
            placeholder="Select your Tool"
            onChange={handleToolSelect}
          >
            {/* @ts-ignore */}
            {allTools?.data.map((tool) => {
              return (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              );
            })}
          </Select>
        )}
        {playerChoice !== "" && (
          <>
            <Text fontSize="small" mt="8">
              YOUR CHOICE:
            </Text>
            <Card minW="md" variant="outline" alignContent="center">
              <CardHeader
                fontSize="large"
                color={
                  results?.data.winner === playerChoice
                    ? "green"
                    : results?.data.loser === playerChoice
                    ? "red"
                    : "black"
                }
                fontWeight="bold"
              >
                {playerChoice.toUpperCase()}
              </CardHeader>
            </Card>
            {!toolLocked && (
              <Button onClick={handleToolLock}>Lock In Your Tool</Button>
            )}
            {computerChoice !== "" && (
              <>
                <Text fontSize="small" mt="8">
                  COMPUTER'S CHOICE:
                </Text>
                <Card minW="md" variant="outline" alignContent="center">
                  <CardHeader
                    fontSize="large"
                    color={
                      results?.data.winner === computerChoice
                        ? "green"
                        : results?.data.loser === computerChoice
                        ? "red"
                        : "black"
                    }
                    fontWeight="bold"
                  >
                    {computerChoice.toUpperCase()}
                  </CardHeader>
                </Card>
                {results && (
                  <Heading mt="8">
                    {results.data.winner} {results.data.outcome}{" "}
                    {results.data.loser}
                  </Heading>
                )}
                {!results && (
                  <Button onClick={() => refetch()}>Let's Play!</Button>
                )}
                {results && <Button mt="4">Restart</Button>}
              </>
            )}
          </>
        )}
      </VStack>
    </Flex>
  );
}

export default App;
