#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int main() {
    int N;
    cin >> N;
    
    vector<vector<int>> bestGrid;
    int bestM = 0;
    long long maxDiagSum = LLONG_MIN;
    
    for (int i = 0; i < N; i++) {
        int M;
        cin >> M;
        
        vector<vector<int>> grid(M, vector<int>(M));
        for (int j = 0; j < M; j++) {
            for (int k = 0; k < M; k++) {
                cin >> grid[j][k];
            }
        }
        
        long long diagSum = 0;
        for (int j = 0; j < M; j++) {
            diagSum += grid[j][j];
            if (j != M - 1 - j) {
                diagSum += grid[j][M - 1 - j];
            }
        }
        
        if (diagSum > maxDiagSum) {
            maxDiagSum = diagSum;
            bestM = M;
            bestGrid = grid;
        }
    }
    
    long long maxSum = LLONG_MIN;
    
    for (int i = 0; i < bestM; i++) {
        for (int j = 0; j < bestM; j++) {
            for (int k = i; k < bestM; k++) {
                for (int l = j; l < bestM; l++) {
                    long long sum = 0;
                    for (int x = i; x <= k; x++) {
                        for (int y = j; y <= l; y++) {
                            sum += bestGrid[x][y];
                        }
                    }
                    maxSum = max(maxSum, sum);
                }
            }
        }
    }
    
    long long result = maxSum % 10007;
    if (result < 0) result += 10007;
    cout << result << endl;
    
    return 0;
}