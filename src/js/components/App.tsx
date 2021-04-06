import React, {ChangeEvent} from "react";
import styled from 'styled-components';

const Squares = styled.div`
  width: fit-content;
  margin-top: 25px;
  margin-bottom: 25px;

  .square-row {
    display: grid;
    grid-template-columns: repeat(${(props: { grid: number; }) => props.grid}, 50px);
    height: 50px;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
  }

  .square-row:last-child {
    border-bottom: 1px solid black;
  }

  .square-row div:not(:last-child) {
    border-right: 1px solid black;
  }

  .square-row div.white {
    background: #fff;
  }

  .square-row div.blue {
    background: blue;
  }
`

export const App: React.FC = () => {
    const [modes, setModes] = React.useState<undefined | any[]>()
    const [grid, setGrid] = React.useState<number>(0)
    const [matrix, setMatrix] = React.useState<boolean[][] | null>(null)
    const [start, setStart] = React.useState<boolean>(false)
    const [hoveredDivs, setHoveredDivs] = React.useState<{ row: number, col: number }[] | null>(null)

    React.useEffect(() => {
        (async function GetModes() {
            try {
                let response = await fetch('http://demo1030918.mockable.io/')
                let modes = await response.json()
                setModes(modes)
                let initialGrid = modes[Object.keys(modes)[0].toString()].field
                setGrid(initialGrid)
                const matrix: boolean[][] = []
                for (let i = 0; i < initialGrid; i++) {
                    matrix.push([])
                    for (let j = 0; j < initialGrid; j++) {
                        matrix[i].push(false)
                    }
                }
                setMatrix(matrix)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    let HandleChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        let grid = +event.target.value
        setGrid(grid)
        const matrix: boolean[][] = []
        for (let i = 0; i < grid; i++) {
            matrix.push([])
            for (let j = 0; j < grid; j++) {
                matrix[i].push(false)
            }
        }
        setMatrix(matrix)
        setHoveredDivs(null)
    }

    let HandleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, iRow: number, iDiv: number) => {
        if (matrix && start) {

            const newMatrix = [...matrix]
            newMatrix[iRow][iDiv] = !newMatrix[iRow][iDiv]
            setMatrix(newMatrix)
            if (newMatrix[iRow][iDiv]) {
                if (hoveredDivs) {
                    const newHoveredDivs = [...hoveredDivs]
                    newHoveredDivs.unshift({row: iRow + 1, col: iDiv + 1})
                    setHoveredDivs(newHoveredDivs)
                } else {
                    setHoveredDivs([{row: iRow + 1, col: iDiv + 1}])
                }
            } else {
                if (hoveredDivs) {
                    let newHoveredDivs = hoveredDivs.slice()
                    let deleteItemIndex = newHoveredDivs.findIndex((el) =>
                        el.col == iDiv + 1 && el.row == iRow + 1
                    )
                    let before = newHoveredDivs.slice(0, deleteItemIndex)
                    let after = newHoveredDivs.slice(deleteItemIndex + 1)
                    setHoveredDivs([...before, ...after])
                }
            }
        }
    }
    return (
        <div className={'container-game'}>
            <div className="container-game-action">
              <div className="mode">
                  <select defaultValue={grid}
                          onChange={HandleChangeSelect}
                          className="form-select"
                          aria-label="Default select example">
                      {modes && Object.entries(modes)
                          .map((el, i) => <option key={i} value={el[1].field}>{el[0]}</option>
                          )}
                  </select>

                  <button type="button" className="btn btn-primary" onClick={() => {
                      setGrid(grid)
                      setStart(!start)
                  }}>{start ? 'Stop' : 'Start'}</button>
              </div>

                <Squares grid={grid}>
                    {matrix?.map((elRow, iRow) =>
                        <div key={iRow} className={'square-row'}>
                            {elRow.map((elDiv, iDiv) => <div
                                onMouseEnter={(e) => HandleMouseEnter(e, iRow, iDiv)}
                                className={elDiv === true ? 'blue' : 'white'} key={iDiv + iRow + grid}/>)}
                        </div>
                    )}
                </Squares>
            </div>
            <div className="container-game-hover">
                <h3>Hover Squares</h3>
                {hoveredDivs && hoveredDivs.map((el, i) =>
                    <div className={'item'} key={i}>{`row ${el.row} col ${el.col}`}</div>)}
            </div>
        </div>
    )
}