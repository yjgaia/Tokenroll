# Tokenroll
음악은 로큰롤, 토큰 거래는 토큰롤

수수료도 없고 중앙관리자도 없는 완전-탈중앙화 토큰 거래소

ERC-20, ERC-721 토큰 거래 가능

Decentralized Exchange

DApp에 그냥 붙히면 됩니다.

알려진 토큰 지갑과 정보에 대해서는 Issues에 남겨주시기 바랍니다.

## ERC-20 <-> 이더
- ![테스트 여부](https://img.shields.io/badge/테스트%20여부-yes-brightgreen.svg) `bid(address token, uint256 amount)` 토큰 구매 정보를 거래소에 등록합니다.
- ![테스트 여부](https://img.shields.io/badge/테스트%20여부-yes-brightgreen.svg) `cancelBid(uint256 bidId)` 토큰 구매를 취소합니다.
- ![테스트 여부](https://img.shields.io/badge/테스트%20여부-yes-brightgreen.svg) `sell(uint256 bidId, uint256 amount)` 구매 등록된 토큰을 판매합니다.
- ![테스트 여부](https://img.shields.io/badge/테스트%20여부-yes-brightgreen.svg) `offer(address token, uint256 amount, uint256 price)` 토큰 판매 정보를 거래소에 등록합니다.
- ![테스트 여부](https://img.shields.io/badge/테스트%20여부-yes-brightgreen.svg) `cancelOffer(uint256 offerId)` 토큰 판매를 취소합니다.
- ![테스트 여부](https://img.shields.io/badge/테스트%20여부-yes-brightgreen.svg) `buy(uint256 offerId, uint256 amount)` 판매 등록된 토큰을 구매합니다.

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)
